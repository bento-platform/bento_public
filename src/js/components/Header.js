// Header.js
import React, {useEffect} from "react";
import { connect, useSelector } from "react-redux";
import { PageHeader, Button } from "antd";
import { client } from "../constants";

const Header = () => {
  const portalUrl = useSelector((state) => state.config.portalUrl);

  useEffect(() => {
    document.title = "Bento-Public : " + client;
  }, []);
  
  const buttonHandler = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        title="Bento-Public"
        subTitle={client}
        extra={[
          <Button key="0" onClick={() => buttonHandler(portalUrl)}>
            Portal
          </Button>,
        ]}
      />
    </div>
  );
};

export default Header;