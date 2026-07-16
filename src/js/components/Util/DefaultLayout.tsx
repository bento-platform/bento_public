import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { FloatButton, Grid, Layout } from 'antd';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';
import PcglFooter from '@/components/Pcgl/PcglFooter';
import ScopeHeader from '@/components/Scope/ScopeHeader';
import { useSelectedScope, useScopeHasData } from '@/features/metadata/hooks';
import { useIsInCatalogueMode, useSidebarMenuItems } from '@/hooks/navigation';
import { useTitleBreadcrumbItems } from '@/hooks/useTitleBreadcrumbItems';
import { PCGL_MODE } from '@/config';
import { BentoRoute } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const DefaultLayout = () => {
  const location = useLocation();
  const page = getCurrentPage(location);

  const catalogueMode = useIsInCatalogueMode();
  const { scopeSet, scope } = useSelectedScope();
  const scopeHasData = useScopeHasData();

  const menuItems = useSidebarMenuItems();
  const [collapsed, setCollapsed] = useState(true);

  const breakpoints = useBreakpoint();

  const isCatalogue = scopeSet && !scope.project && catalogueMode && page === 'overview';
  const sidebarOverlay = !breakpoints.lg;
  const sidebarOverlayShown = sidebarOverlay && !collapsed;
  // TODO: enable sidebar with catalogue when catalogue filtering/search is hooked up
  const sidebarHidden = page !== 'overview' || isCatalogue || (!isCatalogue && !scopeHasData);

  const showSidebarToggle = sidebarOverlay && page === 'overview';

  const breadcrumbItems = useTitleBreadcrumbItems();
  const scopeHeaderHidden = isCatalogue || (!isCatalogue && !breadcrumbItems.length && !showSidebarToggle);

  return (
    <Layout
      id="default-layout"
      className={clsx('sidebar-hidden', `page-${isCatalogue ? 'catalogue' : page}`, {
        'scope-header-hidden': scopeHeaderHidden,
      })}
    >
      <SiteHeader menuItems={!scope.project ? menuItems : []} />
      <Layout id="content-layout">
        {!isCatalogue && !scopeHeaderHidden && (
          <ScopeHeader
            showSidebarToggle={showSidebarToggle}
            sidebarOverlayShown={sidebarOverlayShown}
            onToggleSidebar={() => setCollapsed((c) => !c)}
            breadcrumbItems={breadcrumbItems}
            // TODO: figure out conditional logic
            menuItems={scope.project && page !== BentoRoute.Phenopackets ? menuItems : []}
          />
        )}
        <Layout>
          <Layout>
            {!sidebarHidden && <SiteSider collapsed={collapsed} overlay={sidebarOverlay} />}
            {sidebarOverlayShown ? (
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 18, backdropFilter: 'blur(10px)' }}
                onClick={(e) => {
                  setCollapsed(true);
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-hidden
              />
            ) : null}
            <Content style={{ minHeight: 'calc(100vh - 210px - var(--scoped-title-height) - var(--header-height))' }}>
              <Outlet />
            </Content>
          </Layout>
          {PCGL_MODE ? <PcglFooter /> : <SiteFooter />}
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
