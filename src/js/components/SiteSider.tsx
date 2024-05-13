import React, { useState } from 'react';
import { Flex, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { CompassOutlined, PieChartOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const iconBackgroundStyle = {
  backgroundColor: '#FFFFFF25',
  borderRadius: '10px',
  padding: '10px',
  margin: '16px',
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Overview', '1', <PieChartOutlined />),
  getItem('Search', '2', <SearchOutlined />),
  getItem('Beacon', '9', <CompassOutlined />),
  getItem('Provenance', '9', <SolutionOutlined />),
];

const SiteSider = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Flex style={{ width: '100%' }} justify="center" align="center">
        <Flex style={iconBackgroundStyle} justify="center" align="center">
          <a href="/">
            <img style={{ height: '32px' }} src="/public/assets/branding.png" alt="logo" />
          </a>
        </Flex>
      </Flex>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  );
};
export default SiteSider;
