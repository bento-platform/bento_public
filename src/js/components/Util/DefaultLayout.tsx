import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Button, Flex, FloatButton, Grid, Layout } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import AboutContent from '@/components/AboutContent';
import SiteHeader from '@/components/SiteHeader';
import SiteSider from '@/components/SiteSider';
import SiteFooter from '@/components/SiteFooter';
import PageHeader from '@/components/PageHeader';
import PcglFooter from '@/components/Pcgl/PcglFooter';
import ScopedTitle from '@/components/Scope/ScopedTitle';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useIsInCatalogueMode, useSidebarMenuItems } from '@/hooks/navigation';
import { PCGL_MODE } from '@/config';
import { BentoRoute } from '@/types/routes';
import clsx from 'clsx';
import { getCurrentPage } from '@/utils/router';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const DefaultLayout = () => {
  const location = useLocation();
  const page = getCurrentPage(location);

  const catalogueMode = useIsInCatalogueMode();
  const { scopeSet, scope } = useSelectedScope();

  const menuItems = useSidebarMenuItems();
  const [collapsed, setCollapsed] = useState(true);

  const breakpoints = useBreakpoint();

  const isCatalogue = scopeSet && !scope.project && catalogueMode && page === 'overview';
  const sidebarOverlay = !breakpoints.lg;
  const sidebarOverlayShown = sidebarOverlay && !collapsed;
  const sidebarHidden = page !== 'overview';

  const showSidebarToggle = sidebarOverlay && page === 'overview';

  return (
    <Layout id="default-layout" className={clsx('sidebar-hidden', `page-${page}`)}>
      <SiteHeader menuItems={menuItems} />
      <Layout id="content-layout">
        <PageHeader catalogue={isCatalogue}>
          {isCatalogue ? (
            <AboutContent />
          ) : (
            <Flex
              style={{
                paddingLeft: showSidebarToggle ? undefined : 'var(--content-padding-h)',
                paddingRight: 'var(--content-padding-h)',
              }}
            >
              {showSidebarToggle && (
                <Button
                  id="page-header__sidebar-toggle"
                  className={sidebarOverlayShown ? 'active' : ''}
                  icon={<FilterOutlined />}
                  color="default"
                  variant="filled"
                  size="large"
                  onMouseDown={() => setCollapsed((c) => !c)}
                />
              )}
              <ScopedTitle />
            </Flex>
          )}
        </PageHeader>
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
            <Content>
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
