import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Icon, { PieChartOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';
const { Sider } = Layout;

import BeaconSvg from '@/components/Beacon/BeaconSvg';
import { useAppSelector, useTranslationDefault } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';
import { getCurrentPage } from '@/utils/router';
import { BentoRoutes } from '@/types/routes';

type CustomIconComponentProps = React.ComponentProps<typeof Icon>;
type MenuItem = Required<MenuProps>['items'][number];
type OnClick = MenuProps['onClick'];

const BeaconLogo: React.FC<Partial<CustomIconComponentProps>> = (props) => <Icon component={BeaconSvg} {...props} />;

const SiteSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const td = useTranslationDefault();
  const [collapsed, setCollapsed] = useState(false);
  const queryParams = useAppSelector((state) => state.query.queryParams);
  const currentPage = getCurrentPage();

  const handleMenuClick: OnClick = useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/');
      const currentLang = currentPath[1];
      const newPath = `/${currentLang}/${key === BentoRoutes.Overview ? '' : key}`;
      navigate(key === BentoRoutes.Search ? buildQueryParamsUrl(newPath, queryParams) : newPath);
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
      createMenuItem('Overview', 'overview', <PieChartOutlined />),
      createMenuItem('Search', 'search', <SearchOutlined />),
      createMenuItem('Beacon', 'beacon', <BeaconLogo />),
      createMenuItem('Provenance', 'provenance', <SolutionOutlined />),
    ],
    [createMenuItem]
  );

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="light">
      <Menu selectedKeys={[currentPage]} mode="inline" items={menuItems} onClick={handleMenuClick} />
    </Sider>
  );
};

export default SiteSider;
