import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Tabs, Typography } from 'antd';

const { Title } = Typography;

import { makeGetConfigRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi'
import { DEFAULT_TRANSLATION } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';

const TabbedDashboard = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();
  const { page } = useParams<{ page?: string }>();

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());

  }, []);

  const isFetchingOverviewData = useAppSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useAppSelector((state) => state.query.isFetchingFields);
  const isFetchingBeaconConfig = useAppSelector((state) => state.beaconConfig?.isFetchingBeaconConfig)
  const renderBeaconUi = useAppSelector((state) => state.config?.beaconEnabled)

  const onChange = useCallback(
    (key: string) => {
      const currentPath = location.pathname;
      const currentPathParts = currentPath.split('/');
      const currentLang = currentPathParts[1];
      const newPath = `/${currentLang}/${key === 'overview' ? '' : key}`;
      navigate(newPath);
    },
    [location, navigate]
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
      active: renderBeaconUi,
      key: 'beacon',
    },
    {
      title: 'Provenance',
      content: <ProvenanceTab />,
      loading: false,
      active: true,
      key: 'provenance',
    },
  ];

  const mappedTabPanes = tabPanes.filter(t => t.active).map(({ title, content, loading, key }) => ({
    label: <TabTitle title={t(title)} />,
    children: loading ? <Loader /> : content,
    key,
  }));

  return <Tabs activeKey={page ?? 'overview'} items={mappedTabPanes} onChange={onChange} centered />;
};

export default TabbedDashboard;
