import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';
import ScopeTitle from '@/components/Scope/ScopeTitle';

const { Content } = Layout;

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          id="content-layout"
          style={{
            position: 'fixed',
            top: 64,
            right: 0,
            bottom: 0,
            left: collapsed ? '80px' : '200px',
            transition: 'left 0.3s',
            width: 'calc(100% - 200px)', // TODO
            overflow: 'auto',
            display: 'block',
            // marginTop: '64px',
          }}
        >
          <Content style={{ padding: '32px 64px' }}>
            <ScopeTitle />
            <Outlet />
          </Content>
          <SiteFooter />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
