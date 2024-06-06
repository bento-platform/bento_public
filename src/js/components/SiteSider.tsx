import React, { useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import type { MenuProps, SiderProps } from 'antd';
import Icon, { PieChartOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';

import BeaconSvg from '@/components/Beacon/BeaconSvg';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';
import { getCurrentPage } from '@/utils/router';
import { BentoRoute } from '@/types/routes';

const { Sider } = Layout;

type CustomIconComponentProps = React.ComponentProps<typeof Icon>;
type MenuItem = Required<MenuProps>['items'][number];
type OnClick = MenuProps['onClick'];

const BeaconLogo: React.FC<Partial<CustomIconComponentProps>> = (props) => <Icon component={BeaconSvg} {...props} />;

const SiteSider: React.FC<{
  collapsed: boolean;
  setCollapsed: SiderProps['onCollapse'];
}> = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const td = useTranslationDefault();
  const queryParams = useAppSelector((state) => state.query.queryParams);
  const currentPage = getCurrentPage();

  const handleMenuClick: OnClick = useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/');
      const currentLang = currentPath[1];
      const newPath = `/${currentLang}/${key === BentoRoute.Overview ? '' : key}`;
      navigate(key === BentoRoute.Search ? buildQueryParamsUrl(newPath, queryParams) : newPath);
    },
    [navigate, queryParams, location.pathname]
  );

  const createMenuItem = useCallback(
    (label: string, key: string, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => ({
      key,
      icon,
      children,
      label: td(label),
    }),
    [td]
  );

  const menuItems: MenuItem[] = useMemo(
    () => [
      createMenuItem('Overview', BentoRoute.Overview, <PieChartOutlined />),
      createMenuItem('Search', BentoRoute.Search, <SearchOutlined />),
      createMenuItem('Beacon', BentoRoute.Beacon, <BeaconLogo />),
      createMenuItem('Provenance', BentoRoute.Provenance, <SolutionOutlined />),
    ],
    [createMenuItem]
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme="light"
      style={{ overflow: 'auto', height: 'calc(100vh - 64px)', position: 'fixed', left: 0, top: '64px' }}
    >
      <Menu selectedKeys={[currentPage]} mode="inline" items={menuItems} onClick={handleMenuClick} />
    </Sider>
  );
};

export default SiteSider;
