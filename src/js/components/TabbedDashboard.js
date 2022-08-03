import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Search from './Search/Search';
import PublicOverview from './overview/PublicOverview';

import { makeGetDataRequest } from '../features/data/data';
import { makeGetConfigRequest } from '../features/config/config';

import Loader from './Loader';
import { makeGetSearchFields } from '../features/search/query';

const { TabPane } = Tabs;

const TabbedDashboard = () => {
  const dispatch = useDispatch();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetDataRequest()).then(() => { // Sequential call intended for backend related issues
      dispatch(makeGetSearchFields());
    });
  }, []);

  const tabTitleStyle = { fontSize: '20px', fontWeight: 500 };
  const tabBarStyle = { marginBottom: '20px' };

  const overviewTabTitle = <p style={tabTitleStyle}>Overview</p>;
  const searchTabTitle = <p style={tabTitleStyle}>Search</p>;

  const isFetchingOverviewData = useSelector((state) => state.data.isFetchingData);
  const isFetchingSearchFields = useSelector((state) => state.query.isFetchingFields);

  return (
    <div style={{ paddingLeft: '25px' }}>
      <Tabs defaultActiveKey="overview" size="large" tabBarStyle={tabBarStyle} centered>
        <TabPane tab={overviewTabTitle} key="overview" size="large">
          {!isFetchingOverviewData ? <PublicOverview /> : <Loader />}
        </TabPane>
        <TabPane tab={searchTabTitle} key="search">
          {!isFetchingSearchFields ? <Search /> : <Loader />}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabbedDashboard;
