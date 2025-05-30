import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps, SiderProps } from 'antd';
import { Button, Divider, Layout, Menu } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { TEXT_QUERY_PARAM } from '@/features/search/constants';
import { useNonFilterQueryParams, useSearchQuery } from '@/features/search/hooks';
import { buildQueryParamsUrl, combineQueryParamsWithoutKey } from '@/features/search/utils';
import { useTranslationFn } from '@/hooks';
import { useGetRouteTitleAndIcon, useIsInCatalogueMode, useNavigateToRoot } from '@/hooks/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { getCurrentPage } from '@/utils/router';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
type OnClick = MenuProps['onClick'];

const SiteSider = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: SiderProps['onCollapse'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const t = useTranslationFn();
  const { mode: queryMode, filterQueryParams } = useSearchQuery();
  const otherQueryParams = useNonFilterQueryParams();
  const catalogueMode = useIsInCatalogueMode();
  const currentPage = getCurrentPage(location);

  const navigateToRoot = useNavigateToRoot();
  const { fixedProject, scope, scopeSet } = useSelectedScope();

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
      navigate(
        key === BentoRoute.Search
          ? buildQueryParamsUrl(
              newPathString,
              queryMode === 'filters'
                ? combineQueryParamsWithoutKey(filterQueryParams, otherQueryParams, TEXT_QUERY_PARAM)
                : otherQueryParams
            )
          : newPathString
      );
    },
    [navigate, queryMode, filterQueryParams, otherQueryParams, location.pathname]
  );

  const createMenuItem = useCallback(
    (key: string, label: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => ({
      key,
      icon,
      children,
      label: t(label),
    }),
    [t]
  );

  const getRouteTitleAndIcon = useGetRouteTitleAndIcon();

  const menuItems: MenuItem[] = useMemo(() => {
    const items = [
      createMenuItem(BentoRoute.Overview, ...getRouteTitleAndIcon(BentoRoute.Overview)),
      createMenuItem(BentoRoute.Search, ...getRouteTitleAndIcon(BentoRoute.Search)),
    ];

    if (scope.project) {
      // Only show provenance if we're not at the top level, since the giant list of context-less datasets is confusing.
      items.push(createMenuItem(BentoRoute.Provenance, ...getRouteTitleAndIcon(BentoRoute.Provenance)));
    }

    if (BentoRoute.Beacon) {
      items.push(createMenuItem(BentoRoute.Beacon, ...getRouteTitleAndIcon(BentoRoute.Beacon)));
    }

    if (BentoRoute.BeaconNetwork && (!scope.project || (scope.project && fixedProject))) {
      items.push(createMenuItem(BentoRoute.BeaconNetwork, ...getRouteTitleAndIcon(BentoRoute.BeaconNetwork)));
    }

    return items;
  }, [getRouteTitleAndIcon, createMenuItem, scope, fixedProject]);

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
    >
      {scope.project && catalogueMode && (
        <>
          <div style={{ backgroundColor: '#FAFAFA' }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              style={{ margin: 4, width: 'calc(100% - 8px)', height: 38 }}
              onClick={scope.dataset ? () => navigate(`/${i18n.language}/p/${scope.project}`) : navigateToRoot}
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
        items={menuItems}
        onClick={handleMenuClick}
        style={{ border: 'none' }}
      />
    </Sider>
  );
};

export default SiteSider;
