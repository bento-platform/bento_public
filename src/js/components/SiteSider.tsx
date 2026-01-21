import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps, SiderProps } from 'antd';
import { Button, Divider, Layout, Menu } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useAllOverviewQueryParams } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useIsInCatalogueMode, useNavigateToRoot } from '@/hooks/navigation';
import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const { Sider } = Layout;

type OnClick = MenuProps['onClick'];

const SiteSider = ({
  collapsed,
  setCollapsed,
  items,
  hidden,
}: {
  collapsed: boolean;
  setCollapsed: SiderProps['onCollapse'];
  items: MenuItem[];
  hidden: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const language = useLanguage();
  const t = useTranslationFn();
  const overviewQueryParams = useAllOverviewQueryParams();
  const catalogueMode = useIsInCatalogueMode();
  const currentPage = getCurrentPage(location);

  const navigateToRoot = useNavigateToRoot();
  const { scope, scopeSet } = useSelectedScope();

  const handleMenuClick: OnClick = useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/').filter(Boolean);
      const newPath = [currentPath[0]];
      if (!TOP_LEVEL_ONLY_ROUTES.includes(key)) {
        // Beacon network only works at the top scope level
        if (currentPath[1] == 'p') {
          newPath.push('p', currentPath[2]);
        }
        if (currentPath[3] == 'd') {
          newPath.push('d', currentPath[4]);
        }
      }
      newPath.push(key);
      const newPathString = '/' + newPath.join('/');
      // Navigate to the menu item url
      //  - only include filter/search/overview query params if we're navigating to the overview page
      navigate(buildQueryParamsUrl(newPathString, key === BentoRoute.Overview ? overviewQueryParams : undefined));
    },
    [navigate, overviewQueryParams, location.pathname]
  );

  return (
    <Sider
      id="site-sider"
      // Collapsed width can be synced with our stylesheet via CSS variable:
      collapsedWidth="var(--sidebar-width-collapsed)"
      collapsible
      breakpoint="md"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      aria-hidden={hidden}
    >
      {scope.project && catalogueMode && (
        <>
          <div style={{ backgroundColor: '#FAFAFA' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ margin: 4, width: 'calc(100% - 8px)', height: 38 }}
              onClick={scope.dataset ? () => navigate(`/${language}/p/${scope.project}`) : navigateToRoot}
            >
              {collapsed || !scopeSet ? null : t(scope.dataset ? 'Back to project' : 'Back to catalogue')}
            </Button>
          </div>
          <Divider className="m-0" />
        </>
      )}
      <Menu
        selectedKeys={[currentPage]}
        mode="inline"
        items={items}
        onClick={handleMenuClick}
        style={{ border: 'none' }}
      />
    </Sider>
  );
};

export default SiteSider;
