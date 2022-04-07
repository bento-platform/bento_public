import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Search from "./Search";
import PublicOverview from "./PublicOverview";
import { configUrl, publicOverviewUrl, queryableFieldsUrl } from "../constants";
import { makeGetConfigRequest, makeGetOverviewRequest, makeGetQueryableFieldsRequest } from "../action";

const TabbedDashboard = ({}) => {
  const visibleTab = useSelector((state) => state.visibleTab);
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
      }[visibleTab] || <PublicOverview />}
    </>
  );
};

export default TabbedDashboard;