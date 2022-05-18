import React, { useEffect } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Tabs } from 'antd';
import Search from './Search';
import PublicOverview from './overview/PublicOverview';
import { configUrl, publicOverviewUrl, queryableFieldsUrl } from '../constants';
import {
  makeGetConfigRequest,
  makeGetOverviewRequest,
  makeGetQueryableFieldsRequest,
} from '../action';
import Loader from './Loader';

const { TabPane } = Tabs;

const TabbedDashboard = ({ overview, queryParameterStack }) => {
  const dispatch = useDispatch();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest(configUrl));
    dispatch(makeGetOverviewRequest(publicOverviewUrl));
    dispatch(makeGetQueryableFieldsRequest(queryableFieldsUrl));
  }, []);

  const tabTitleStyle = { fontSize: '20px', fontWeight: 600 };
  const tabBarStyle = { marginBottom: '20px' };

  const overviewTabTitle = <p style={tabTitleStyle}>Overview</p>;
  const searchTabTitle = <p style={tabTitleStyle}>Search</p>;

  return (
    <div style={{ paddingLeft: '25px' }}>
      <Tabs
        defaultActiveKey="overview"
        size="large"
        tabBarStyle={tabBarStyle}
        centered
      >
        <TabPane tab={overviewTabTitle} key="overview" size="large">
          {overview?.overview ? (
            <PublicOverview
              overview={overview.overview}
              queryParameterStack={queryParameterStack}
            />
          ) : (
            <Loader />
          )}
        </TabPane>
        <TabPane tab={searchTabTitle} key="search">
          <Search />
        </TabPane>
      </Tabs>
    </div>
  );
};

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  overview: state.overview,
  queryParameterStack: state.queryParameterStack,
});

export default connect(mapStateToProps, mapDispatchToProps)(TabbedDashboard);
