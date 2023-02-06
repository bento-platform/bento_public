import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography } from 'antd';
const { Title } = Typography;

import { makeGetConfigRequest } from '../features/config/config';
import { makeGetAboutRequest } from '../features/content/content';
import { makeGetDataRequest } from '../features/data/data';
import { makeGetSearchFields } from '../features/search/query';
import { makeGetProvenanceRequest } from '../features/provenance/provenance';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi'

const TabbedDashboard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequest()).then(() => {
      // Sequential call intended for backend related issues
      dispatch(makeGetSearchFields());
    });
    dispatch(makeGetProvenanceRequest());
  }, []);

  const isFetchingOverviewData = useSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useSelector((state) => state.query.isFetchingFields);

<<<<<<< HEAD
  return (
    <div style={{ paddingLeft: '25px' }}>
      <Tabs defaultActiveKey="overview" size="large" tabBarStyle={tabBarStyle} centered>
        <TabPane tab={<TabTitle title="Overview" />} key="overview" size="large">
          {!isFetchingOverviewData ? <PublicOverview /> : <Loader />}
        </TabPane>
        <TabPane tab={<TabTitle title="Search" />} key="search">
          {!isFetchingSearchFields ? <Search /> : <Loader />}
        </TabPane>
        <TabPane tab={<TabTitle title="Beacon" />} key="beacon">
          <BeaconQueryUi /> 
        </TabPane>
        <TabPane tab={<TabTitle title="Provenance" />} key="Provenance">
          <ProvenanceTab />
        </TabPane>
      </Tabs>
    </div>
=======
  const TabTitle = ({ title }) => (
    <Title level={4} style={{ margin: '0' }}>
      {title}
    </Title>
>>>>>>> main
  );

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
