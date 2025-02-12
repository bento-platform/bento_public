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
    <Layout id="default-layout" className={collapsed ? 'sidebar-collapsed' : ''}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout id="content-layout">
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
