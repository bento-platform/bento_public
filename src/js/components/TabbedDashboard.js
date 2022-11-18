import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Tabs, Typography } from 'antd';
const { TabPane } = Tabs;
const { Title } = Typography;

import { makeGetDataRequest } from '../features/data/data';
import { makeGetConfigRequest } from '../features/config/config';
import { makeGetSearchFields } from '../features/search/query';
import { makeGetProvenanceRequest } from '../features/provenance/provenance';

import Loader from './Loader';
import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';

const TabbedDashboard = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetDataRequest()).then(() => {
      // Sequential call intended for backend related issues
      dispatch(makeGetSearchFields());
    });
    dispatch(makeGetProvenanceRequest());
  }, []);

  const tabTitleStyle = { fontSize: '20px', fontWeight: 500 };
  const tabBarStyle = { marginBottom: '20px' };

  const TabTitle = ({ title }) => <p style={tabTitleStyle}>{title}</p>;

  const isFetchingOverviewData = useSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useSelector((state) => state.query.isFetchingFields);
  const individuals = useSelector((state) => state.data.individuals);

  const individualCount = (
    <Title level={5}>
      {t('Individuals')}: {individuals}
    </Title>
  );

  return (
    <div style={{ paddingLeft: '25px' }}>
      <Tabs
        tabBarExtraContent={{ right: individualCount }}
        defaultActiveKey="overview"
        size="large"
        tabBarStyle={tabBarStyle}
        centered
      >
        <TabPane tab={<TabTitle title={t('Overview')} />} key="overview" size="large">
          {!isFetchingOverviewData ? <PublicOverview /> : <Loader />}
        </TabPane>
        <TabPane tab={<TabTitle title={t('Search')} />} key="search">
          {!isFetchingSearchFields ? <Search /> : <Loader />}
        </TabPane>
        <TabPane tab={<TabTitle title={t('Provenance')} />} key="Provenance">
          <ProvenanceTab />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabbedDashboard;
