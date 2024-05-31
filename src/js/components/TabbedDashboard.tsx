import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Tabs, Typography } from 'antd';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';

const { Title } = Typography;

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { getBeaconNetworkConfig } from '@/features/beacon/networkConfig.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import NetworkUi from './BeaconNetwork/NetworkUi';
import DumbNetworkUi from './BeaconNetwork/DumbNetworkUi';
import { useAppDispatch, useAppSelector, useTranslationDefault } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { BEACON_UI_ENABLED } from '@/config';
import { BEACON_NETWORK_UI_ENABLED } from '@/config';
import SitePageLoading from './SitePageLoading';

const TabbedDashboard = () => {
  const dispatch = useAppDispatch();
  const td = useTranslationDefault();
  const navigate = useNavigate();
  const location = useLocation();
  const { page } = useParams<{ page?: string }>();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => {
      dispatch(getBeaconConfig());
      dispatch(getBeaconNetworkConfig());
    });
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());
    dispatch(fetchKatsuData());
    dispatch(fetchGohanData());
    dispatch(makeGetServiceInfoRequest());
    //TODO: Dispatch makeGetDataTypes to get the data types from service-registry
    if (isAuthenticated) {
      dispatch(makeGetDataTypes());
    }
  }, [isAuthenticated]);

  const isFetchingOverviewData = useAppSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useAppSelector((state) => state.query.isFetchingFields);
  const queryParams = useAppSelector((state) => state.query.queryParams);
  const isFetchingBeaconConfig = useAppSelector((state) => state.beaconConfig?.isFetchingBeaconConfig);
  const isFetchingNetworkConfig = useAppSelector((state) => state.beaconNetwork.isFetchingBeaconNetworkConfig);

  const onChange = useCallback(
    (key: string) => {
      const currentPath = location.pathname;
      const currentPathParts = currentPath.split('/');
      const currentLang = currentPathParts[1];
      const newPath = `/${currentLang}/${key === 'overview' ? '' : key}`;
      // If we're going to the search page, insert query params into the URL pulled from the Redux state.
      // This is important to keep the URL updated if we've searched something, navigated away, and now
      // are returning to the search page.
      navigate(key === 'search' ? buildQueryParamsUrl(newPath, queryParams) : newPath);
    },
    [location, navigate, queryParams]
  );

  const TabTitle = ({ title }: { title: string }) => (
    <Title level={4} style={{ margin: '0' }}>
      {title}
    </Title>
  );

  const tabPanes = [
    {
      title: 'Overview',
      content: <PublicOverview />,
      loading: isFetchingOverviewData,
      active: true,
      key: 'overview',
    },
    {
      title: 'Search',
      content: <Search />,
      loading: isFetchingSearchFields,
      active: true,
      key: 'search',
    },
    {
      title: 'Beacon',
      content: <BeaconQueryUi />,
      loading: isFetchingBeaconConfig,
      active: BEACON_UI_ENABLED,
      key: 'beacon',
    },
    {
      title: 'Beacon Network',
      content: <NetworkUi />,
      loading: isFetchingNetworkConfig,
      active: BEACON_NETWORK_UI_ENABLED,
      key: 'beacon_network',
    },
    {
      title: 'Provenance',
      content: <ProvenanceTab />,
      loading: false,
      active: true,
      key: 'provenance',
    },
  ];

  const mappedTabPanes = tabPanes
    .filter((t) => t.active)
    .map(({ title, content, loading, key }) => ({
      label: <TabTitle title={td(title)} />,
      children: loading ? <Loader /> : content,
      key,
    }));

  const getTabKey = (page: string | undefined) => {
    if (page && mappedTabPanes.map((t) => t.key).includes(page)) {
      return page;
    }
    return 'overview';
  };

  if (isAutoAuthenticating) {
    return <SitePageLoading />;
  }

  return <Tabs activeKey={getTabKey(page)} items={mappedTabPanes} onChange={onChange} centered />;
};

export default TabbedDashboard;
