import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd';
import Search from './Search/Search';
import PublicOverview from './overview/PublicOverview';

import { makeGetDataRequest } from '../features/data';
import { makeGetConfigRequest } from '../features/config';

import Loader from './Loader';

const { TabPane } = Tabs;

const TabbedDashboard = () => {
  const dispatch = useDispatch();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest());
    dispatch(makeGetDataRequest());
  }, []);

  const tabTitleStyle = { fontSize: '20px', fontWeight: 600 };
  const tabBarStyle = { marginBottom: '20px' };

  const overviewTabTitle = <p style={tabTitleStyle}>Overview</p>;
  const searchTabTitle = <p style={tabTitleStyle}>Search</p>;

  const isFetchingData = useSelector((state) => state.data.isFetchingData);

  return (
    <div style={{ paddingLeft: '25px' }}>
      <Tabs
        defaultActiveKey="overview"
        size="large"
        tabBarStyle={tabBarStyle}
        centered
      >
        <TabPane tab={overviewTabTitle} key="overview" size="large">
          {!isFetchingData ? <PublicOverview /> : <Loader />}
        </TabPane>
        <TabPane tab={searchTabTitle} key="search">
          <Search />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default TabbedDashboard;
