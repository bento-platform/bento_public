import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatButton, Layout } from 'antd';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';
import ScopedTitle from '@/components/Scope/ScopedTitle';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const { Content } = Layout;

const DefaultLayout = () => {
  const location = useLocation();
  const page = getCurrentPage(location);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout id="default-layout" className={collapsed ? 'sidebar-collapsed' : ''}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout id="content-layout">
          <Content>
            <ScopedTitle />
            <Outlet />
          </Content>
          <SiteFooter />
          {/* Overview has its own way of rendering a back-to-top button, so we only render this if we're not on the overview page: */}
          {page !== BentoRoute.Overview ? (
            <FloatButton.BackTop className="float-btn-pos" target={() => document.getElementById('content-layout')!} />
          ) : null}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
