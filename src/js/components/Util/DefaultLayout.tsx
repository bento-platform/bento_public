import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';

const { Content } = Layout;

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          style={{
            marginLeft: collapsed ? '80px' : '200px',
            transition: 'margin-left 0.3s',
            marginTop: '64px',
          }}
        >
          <Content style={{ padding: '32px 64px' }}>
            <Outlet />
          </Content>
          <SiteFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
