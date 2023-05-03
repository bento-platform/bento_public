import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography } from 'antd';
const { Title } = Typography;

import { makeGetConfigRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';

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

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());

  }, []);

  const isFetchingOverviewData = useAppSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useAppSelector((state) => state.query.isFetchingFields);
  const isFetchingBeaconConfig = useAppSelector((state) => state?.beaconConfig?.isFetchingBeaconConfig)


  const TabTitle = ({ title }: { title: string }) => (
    <Title level={4} style={{ margin: '0' }}>
      {title}
    </Title>
  );


  // TODO: only render beacon tab if beacon being used 

  const tabPanes = [
    {
      title: 'Overview',
      content: <PublicOverview />,
      loading: isFetchingOverviewData,
      key: 'overview',
    },
    {
      title: 'Search',
      content: <Search />,
      loading: isFetchingSearchFields,
      key: 'search',
    },
    {
      title: 'Beacon',
      content: <BeaconQueryUi />,
      loading: isFetchingBeaconConfig,
      key: 'beacon',
    },
    {
      title: 'Provenance',
      content: <ProvenanceTab />,
      loading: false,
      key: 'provenance',
    },
  ];

  const mappedTabPanes = tabPanes.map(({ title, content, loading, key }) => ({
    label: <TabTitle title={t(title)} />,
    children: loading ? <Loader /> : content,
    key,
  }));

  return <Tabs defaultActiveKey="overview" items={mappedTabPanes} centered />;
};

export default TabbedDashboard;
