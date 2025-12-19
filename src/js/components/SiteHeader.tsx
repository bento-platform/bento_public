import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Flex, Layout, Menu, type MenuProps, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage, langAndScopeSelectionToUrl } from '@/utils/router';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, SHOW_PORTAL_LINK, SHOW_SIGN_IN, TRANSLATED } from '@/config';

import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useNonFilterQueryParams, useSearchQuery } from '@/features/search/hooks';

const { Header } = Layout;

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

type OnClick = MenuProps['onClick'];
type SiteHeaderProps = {
  menuItems?: MenuItem[];
};

const useHandleMenuClick = (): OnClick => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filterQueryParams } = useSearchQuery();
  const otherQueryParams = useNonFilterQueryParams();

  return useCallback(
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
        key === BentoRoute.Overview
          ? buildQueryParamsUrl(newPathString, { ...filterQueryParams, ...otherQueryParams })
          : newPathString
      );
    },
    [navigate, filterQueryParams, otherQueryParams, location.pathname]
  );
};

const SiteHeader = ({ menuItems }: SiteHeaderProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage(location);

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();
  const selectedScope = useSelectedScope();

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  document.title = CLIENT_NAME && CLIENT_NAME.trim() ? `Bento: ${CLIENT_NAME}` : 'Bento';

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[i18n.language];
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (location.pathname + location.search).replace(new RegExp(`^/${i18n.language}`), `/${newLang}`);
    navigate(path, { replace: true });
  };

  const navigateToOverview = useCallback(
    () => navigate(langAndScopeSelectionToUrl(i18n.language, selectedScope, '')),
    [navigate, i18n.language, selectedScope]
  );

  const handleMenuClick = useHandleMenuClick();

  return (
    <Header id="site-header">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={isSmallScreen ? 'small' : 'middle'} className="flex-1">
          {isSmallScreen ? (
            <object
              type="image/png"
              data="/public/assets/branding.png"
              aria-label="logo"
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingRight: '26px' }}
              onClick={navigateToOverview}
            >
              <img
                src="/public/assets/branding.png"
                alt="logo"
                style={{
                  height: '32px',
                  verticalAlign: 'middle',
                  transform: 'translateY(-3px)',
                  paddingLeft: '23px',
                }}
                onClick={navigateToOverview}
              />
            </object>
          ) : (
            <img
              src="/public/assets/branding.png"
              alt="logo"
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-px)', paddingLeft: '4px' }}
              onClick={navigateToOverview}
            />
          )}
          <Typography.Title level={1} type="secondary" style={{ whiteSpace: 'nowrap' }}>
            {CLIENT_NAME}
          </Typography.Title>
          {(menuItems?.length ?? 0) > 1 ? (
            <Menu
              theme="dark"
              mode="horizontal"
              items={menuItems}
              selectedKeys={[currentPage]}
              onClick={handleMenuClick}
              className="flex-1"
              // style={{ border: 'none' }}
            />
          ) : null}
        </Flex>

        <Space size={isSmallScreen ? 0 : 'small'}>
          {TRANSLATED && (
            <Button
              type="text"
              className="header-button"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {isSmallScreen ? '' : LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
            </Button>
          )}
          {SHOW_PORTAL_LINK && (
            <Button type="text" className="header-button" icon={<LinkOutlined />} onClick={openPortalWindow}>
              {isSmallScreen ? '' : t('Portal')}
              {isSmallScreen || <ExportOutlined />}
            </Button>
          )}
          {SHOW_SIGN_IN &&
            (isAuthenticated ? (
              <Button type="text" className="header-button" icon={<LogoutOutlined />} onClick={performSignOut}>
                {isSmallScreen ? '' : t('Sign Out')}
              </Button>
            ) : (
              <Button type="primary" shape="round" icon={<LoginOutlined />} onClick={performSignIn}>
                {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : isSmallScreen ? '' : t('Sign In')}
              </Button>
            ))}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
