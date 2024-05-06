import React, { useState } from 'react';
import { Col, Flex, Layout, Row } from 'antd';

const { Sider } = Layout;

const iconBackgroundStyle = {
  backgroundColor: '#FFFFFF25',
  borderRadius: '10px',
  padding: '10px',
  margin: '16px',
};

const SiteSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ display: 'flex', alignItems: 'center', height: '100vh' }}
    >
      <Flex style={{ width: '100%' }} justify="center" align="center">
        <Flex style={iconBackgroundStyle} justify="center" align="center">
          <a href="/">
            <img style={{ height: '32px' }} src="/public/assets/branding.png" alt="logo" />
          </a>
        </Flex>
      </Flex>
    </Sider>
  );
};
export default SiteSider;
