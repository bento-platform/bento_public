import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import Icon, { PieChartOutlined, SearchOutlined, SolutionOutlined } from '@ant-design/icons';
const { Sider } = Layout;

import BeaconSvg from '@/components/Beacon/BeaconSvg';
import { getCurrentPage, useAppSelector, useTranslationDefault } from '@/hooks';
import { buildQueryParamsUrl } from '@/utils/search';
import { CUSTOM_LOGO } from '@/config';

const iconBackgroundStyle = {
  backgroundColor: '#FFFFFF25',
  borderRadius: '10px',
  padding: '10px',
  margin: '16px',
};

type CustomIconComponentProps = React.ComponentProps<typeof Icon>;
type MenuItem = Required<MenuProps>['items'][number];
type OnClick = MenuProps['onClick'];

const BeaconLogo: React.FC<Partial<CustomIconComponentProps>> = (props) => <Icon component={BeaconSvg} {...props} />;

const BentoLogo: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <Flex style={{ width: '100%' }} justify="center" align="center">
    <Flex style={iconBackgroundStyle} justify="center" align="center">
      <div className={`logo-container ${collapsed ? 'collapsed' : ''}`}>
        <a href="/">
          <img className="logo" src="/public/assets/bento_branding.png" alt="logo" />
        </a>
      </div>
    </Flex>
  </Flex>
);

const Logo: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const logoSrc = collapsed ? '/public/assets/icon_small.png' : '/public/assets/branding.png';

  return (
    <Flex style={{ width: '100%' }} justify="center" align="center">
      <Flex style={iconBackgroundStyle} justify="center" align="center">
        <div className={collapsed ? 'collapsed' : ''}>
          <a href="/">
            <img
              src={logoSrc}
              alt="logo"
              style={{
                maxWidth: collapsed ? '32px' : '120px',
                maxHeight: '32px',
                transition: 'all 0.3s',
              }}
            />
          </a>
        </div>
      </Flex>
    </Flex>
  );
};

const SiteSider: React.FC = () => {
  const navigate = useNavigate();
  const td = useTranslationDefault();
  const [collapsed, setCollapsed] = useState(false);
  const queryParams = useAppSelector((state) => state.query.queryParams);

  const currentPage = getCurrentPage();
  console.log({ currentPage });

  const handleMenuClick: OnClick = useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/');
      const currentLang = currentPath[1];
      const newPath = `/${currentLang}/${key === 'overview' ? '' : key}`;
      navigate(key === 'search' ? buildQueryParamsUrl(newPath, queryParams) : newPath);
    },
    [navigate, queryParams]
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
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      {CUSTOM_LOGO ? <Logo collapsed={collapsed} /> : <BentoLogo collapsed={collapsed} />}
      <Menu
        theme="dark"
        defaultSelectedKeys={[currentPage]}
        mode="inline"
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SiteSider;
