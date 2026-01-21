import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FloatButton, Layout } from 'antd';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';
import ScopedTitle from '@/components/Scope/ScopedTitle';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode, useSidebarMenuItems } from '@/hooks/navigation';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const { Content } = Layout;

const DefaultLayout = () => {
  const location = useLocation();
  const page = getCurrentPage(location);

  const catalogueMode = useIsInCatalogueMode();
  const { scope } = useSelectedScope();

  const menuItems = useSidebarMenuItems();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarHidden =
    (menuItems.length <= 1 && !(scope.project && catalogueMode)) || page === BentoRoute.Phenopackets;

  return (
    <Layout id="default-layout" className={sidebarHidden ? 'sidebar-hidden' : collapsed ? 'sidebar-collapsed' : ''}>
      <SiteHeader />
      <Layout>
        <SiteSider collapsed={collapsed} setCollapsed={setCollapsed} items={menuItems} hidden={sidebarHidden} />
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
