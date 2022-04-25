import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tabs } from "antd";
import Search from "./Search";
import PublicOverview from "./PublicOverview";
import { configUrl, publicOverviewUrl, queryableFieldsUrl } from "../constants";
import { makeGetConfigRequest, makeGetOverviewRequest, makeGetQueryableFieldsRequest } from "../action";

const { TabPane } = Tabs;

const TabbedDashboard = ({}) => {
  const dispatch = useDispatch();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest(configUrl));
    dispatch(makeGetOverviewRequest(publicOverviewUrl));
    dispatch(makeGetQueryableFieldsRequest(queryableFieldsUrl));
  }, []);

  return (
    <div style={{paddingLeft: "25px"}}>
    <Tabs defaultActiveKey="overview" size="large">
      <TabPane tab="Overview" key="overview" size="large"><PublicOverview /></TabPane>
      <TabPane tab="Search" key="search"><Search /></TabPane>
    </Tabs>
    </div>
  )


};

export default TabbedDashboard;