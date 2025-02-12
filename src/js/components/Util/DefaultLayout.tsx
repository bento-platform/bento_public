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

  const sidebarWidth = collapsed ? '80px' : '200px';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout
          id="content-layout"
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            right: 0,
            bottom: 0,
            left: sidebarWidth,
            transition: 'left 0.3s',
            width: `calc(100% - ${sidebarWidth})`,
            overflow: 'auto',
            display: 'block',
          }}
        >
          <Content>
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
