import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { Col, Layout, Menu, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import {
  AppstoreOutlined,
  CompassOutlined,
  DeploymentUnitOutlined,
  SearchOutlined,
  // UserOutlined,
} from '@ant-design/icons';

import { PageRoutes } from '@/types/routes';
import { buildQueryParamsUrl } from '@/utils/search';
import { useAppSelector } from '@/hooks';

const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const getItem = (label: React.ReactNode, key: PageRoutes, icon?: React.ReactNode, children?: MenuItem[]): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
};

const items: MenuItem[] = [
  getItem('Overview', PageRoutes.Overview, <AppstoreOutlined />),
  getItem('Search', PageRoutes.Search, <SearchOutlined />),
  getItem('Beacon', PageRoutes.Beacon, <CompassOutlined />),
  getItem('Provenance', PageRoutes.Provenance, <DeploymentUnitOutlined />),
  // getItem('User', 'sub1', <UserOutlined />, [getItem('Tom', '3'), getItem('Bill', '4'), getItem('Alex', '5')]),
];

const SiteSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [current, setCurrent] = useState<PageRoutes>(PageRoutes.Overview);

  const queryParams = useAppSelector((state) => state.query.queryParams);

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const route = key as PageRoutes;
    setCurrent(route);
    const currentPath = location.pathname;
    const currentPathParts = currentPath.split('/');
    const currentLang = currentPathParts[1];
    const newPath = `/${currentLang}/${key === PageRoutes.Overview ? '' : key}`;
    // If we're going to the search page, insert query params into the URL pulled from the Redux state.
    // This is important to keep the URL updated if we've searched something, navigated away, and now
    // are returning to the search page.
    navigate(key === 'search' ? buildQueryParamsUrl(newPath, queryParams) : newPath);
  };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <Row justify="center" align="middle" style={{height: '64px'}}>
        <Col>
          {collapsed ? (
            <img style={{ marginTop: '15px', height: '32px' }} src="/public/assets/branding_small.png" alt="logo" />
          ) : (
            <img style={{ marginTop: '15px', height: '32px' }} src="/public/assets/branding.png" alt="logo" />
          )}
        </Col>
      </Row>
      <Menu theme="dark" selectedKeys={[current]} mode="inline" items={items} onClick={onClick} />
    </Sider>
  );
};

export default SiteSider;
