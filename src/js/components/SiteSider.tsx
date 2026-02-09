import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps, SiderProps } from 'antd';
import { Button, Divider, Layout, Menu } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQueryParams } from '@/features/search/hooks';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useLanguage, useTranslationFn } from '@/hooks';
import { useIsInCatalogueMode, useNavigateToRoot, useNavigateToSameScopeUrl } from '@/hooks/navigation';
import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage, scopeToUrl } from '@/utils/router';

const { Sider } = Layout;

type OnClick = MenuProps['onClick'];

const NO_BACK_BUTTON = [undefined, undefined] as const;

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
  const overviewQueryParams = useSearchQueryParams();
  const catalogueMode = useIsInCatalogueMode();
  const currentPage = getCurrentPage(location);

  const navigateToRoot = useNavigateToRoot();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();
  const { scope, scopeSet, fixedDataset } = useSelectedScope();

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

  const [backClickText, onBackClick] = useMemo(() => {
    if (!scopeSet) return NO_BACK_BUTTON;
    // Cases where we DO show a back button, given the scope is set:
    //  - We're in a project and in catalog mode
    //  - We're in a dataset and don't have a fixed dataset (a fixed dataset implies a fixed project as well)
    //  - Any time we're on the phenopackets page
    if (
      currentPage !== BentoRoute.Phenopackets &&
      (!(scope.project && catalogueMode) || !(scope.dataset && !fixedDataset))
    ) {
      return NO_BACK_BUTTON;
    }
    if (currentPage === BentoRoute.Phenopackets) {
      return [
        scope.dataset ? 'Back to dataset' : 'Back to project',
        () => navigateToSameScopeUrl(buildQueryParamsUrl(BentoRoute.Overview, overviewQueryParams), false),
      ];
    } else {
      if (scope.dataset) {
        return [
          'Back to project',
          () => navigate(scopeToUrl({ project: scope.project }, language, BentoRoute.Overview)),
        ];
      } else {
        return ['Back to catalogue', navigateToRoot];
      }
    }
  }, [
    catalogueMode,
    currentPage,
    language,
    navigate,
    navigateToRoot,
    navigateToSameScopeUrl,
    overviewQueryParams,
    scope,
    fixedDataset,
    scopeSet,
  ]);

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
      {backClickText !== undefined && onBackClick !== undefined ? (
        <>
          <div style={{ backgroundColor: '#FAFAFA' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ margin: 4, width: 'calc(100% - 8px)', height: 38 }}
              onClick={onBackClick}
            >
              {collapsed ? null : t(backClickText)}
            </Button>
          </div>
          <Divider className="m-0" />
        </>
      ) : null}
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
