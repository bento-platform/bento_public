import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps, SiderProps } from 'antd';
import { Button, Divider, Layout, Menu } from 'antd';
import Icon, {
  ArrowLeftOutlined,
  BookOutlined,
  PieChartOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SolutionOutlined,
} from '@ant-design/icons';

import BeaconSvg from '@/components/Beacon/BeaconSvg';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
import { useNavigateToRoot } from '@/hooks/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/utils/search';
import { getCurrentPage } from '@/utils/router';

const { Sider } = Layout;

type CustomIconComponentProps = React.ComponentProps<typeof Icon>;
type MenuItem = Required<MenuProps>['items'][number];
type OnClick = MenuProps['onClick'];

const BeaconLogo = (props: Partial<CustomIconComponentProps>) => <Icon component={BeaconSvg} {...props} />;

const SiteSider = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: SiderProps['onCollapse'] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const t = useTranslationFn();
  const { projects } = useMetadata();
  const { queryParams } = useSearchQuery();
  const currentPage = getCurrentPage();

  // Use location for catalogue page detection instead of selectedProject, since it gives us faster UI rendering at the
  // cost of only being wrong with a redirect edge case (and being slightly more brittle).
  const overviewIsCatalogue = !location.pathname.includes('/p/') && projects.length > 1;

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
      navigate(key === BentoRoute.Search ? buildQueryParamsUrl(newPathString, queryParams) : newPathString);
    },
    [navigate, queryParams, location.pathname]
  );

  const createMenuItem = useCallback(
    (label: string, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => ({
      key,
      icon,
      children,
      label: t(label),
    }),
    [t]
  );

  const menuItems: MenuItem[] = useMemo(() => {
    const items = [
      createMenuItem(
        overviewIsCatalogue ? 'Catalogue' : 'Overview',
        BentoRoute.Overview,
        overviewIsCatalogue ? <BookOutlined /> : <PieChartOutlined />
      ),
      createMenuItem('Search', BentoRoute.Search, <SearchOutlined />),
    ];

    if (scope.project) {
      // Only show provenance if we're not at the top level, since the giant list of context-less datasets is confusing.
      items.push(createMenuItem('Provenance', BentoRoute.Provenance, <SolutionOutlined />));
    }

    if (BentoRoute.Beacon) {
      items.push(createMenuItem('Beacon', BentoRoute.Beacon, <BeaconLogo />));
    }

    if (BentoRoute.BeaconNetwork && (!scope.project || (scope.project && fixedProject))) {
      items.push(createMenuItem('Beacon Network', BentoRoute.BeaconNetwork, <ShareAltOutlined />));
    }

    return items;
  }, [createMenuItem, scope, fixedProject, overviewIsCatalogue]);

  return (
    <Sider
      collapsible
      breakpoint="md"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      style={{
        overflow: 'auto',
        height: 'calc(100vh - 64px)',
        position: 'fixed',
        left: 0,
        top: '64px',
        zIndex: 100,
        borderRight: '1px solid #f0f0f0',
      }}
    >
      {scope.project && projects.length > 1 && (
        <>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{ margin: 4, width: 'calc(100% - 8px)' }}
            onClick={scope.dataset ? () => navigate(`/${i18n.language}/p/${scope.project}`) : navigateToRoot}
          >
            {collapsed || !scopeSet ? null : t(scope.dataset ? 'Back to project' : 'Back to catalogue')}
          </Button>
          <Divider style={{ margin: 0 }} />
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
