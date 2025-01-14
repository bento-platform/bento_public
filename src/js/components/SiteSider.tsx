import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import type { MenuProps, SiderProps } from 'antd';
import { Layout, Menu } from 'antd';
import Icon, { PieChartOutlined, SearchOutlined, ShareAltOutlined, SolutionOutlined } from '@ant-design/icons';

import BeaconSvg from '@/components/Beacon/BeaconSvg';
import { useSelectedScope } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { useTranslationFn } from '@/hooks';
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
  const t = useTranslationFn();
  const { queryParams } = useSearchQuery();
  const currentPage = getCurrentPage();

  const { fixedProject, scope } = useSelectedScope();

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
      createMenuItem('Overview', BentoRoute.Overview, <PieChartOutlined />),
      createMenuItem('Search', BentoRoute.Search, <SearchOutlined />),
      createMenuItem('Provenance', BentoRoute.Provenance, <SolutionOutlined />),
    ];

    if (BentoRoute.Beacon) {
      items.push(createMenuItem('Beacon', BentoRoute.Beacon, <BeaconLogo />));
    }

    if (BentoRoute.BeaconNetwork && (!scope.project || (scope.project && fixedProject))) {
      items.push(createMenuItem('Beacon Network', BentoRoute.BeaconNetwork, <ShareAltOutlined />));
    }

    return items;
  }, [createMenuItem, scope, fixedProject]);

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
