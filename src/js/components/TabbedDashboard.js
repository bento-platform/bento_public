import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import PublicOverview from "./PublicOverview";
import { configUrl, publicOverviewUrl, queryableFieldsUrl } from "../constants";
import { makeGetConfigRequest, makeGetOverviewRequest, makeGetQueryableFieldsRequest } from "../action";

const TabbedDashboard = ({}) => {
  const activeTab = useSelector((state) => state.activeTab);
  const dispatch = useDispatch();

  // fetch data from server on first render
  useEffect(() => {
    dispatch(makeGetConfigRequest(configUrl));
    dispatch(makeGetOverviewRequest(publicOverviewUrl));
    dispatch(makeGetQueryableFieldsRequest(queryableFieldsUrl));
  }, []);

  // conditionally render visible tab, default to Overview if none
  return (
    <>
      {{
        Overview: <PublicOverview />,
        Search: <Search />,
      }[activeTab] || <PublicOverview />}
    </>
  );
};

export default TabbedDashboard;