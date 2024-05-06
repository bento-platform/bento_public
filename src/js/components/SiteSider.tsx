import React, { useState } from 'react';
import { Col, Layout, Row } from 'antd';

const { Sider } = Layout;

const SiteSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      style={{ display: 'flex', alignItems: 'center', height: '100vh' }}
    >
      <Row justify="center" style={{ width: '100%' }}>
        <Col>
          <div
            style={{
              backgroundColor: '#FFFFFF25',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px', // Fixed height of the inner div
              width: '80%', // Adjust the width based on design requirements
              maxWidth: '300px', // Prevents the div from becoming too wide on larger screens
            }}
          >
            <a href="/">
              <img style={{ height: '32px' }} src="/public/assets/branding.png" alt="logo" />
            </a>
          </div>
        </Col>
      </Row>
    </Sider>
  );
};
export default SiteSider;
