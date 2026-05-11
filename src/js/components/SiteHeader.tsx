import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Flex, Layout, Menu, type MenuProps, Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { useNavigateToRoot } from '@/hooks/navigation';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { getCurrentPage } from '@/utils/router';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, SHOW_HEADER_TITLE, SHOW_PORTAL_LINK, SHOW_SIGN_IN, TRANSLATED } from '@/config';

import type { MenuItem } from '@/types/navigation';
import { BentoRoute, TOP_LEVEL_ONLY_ROUTES } from '@/types/routes';
import { buildQueryParamsUrl } from '@/features/search/utils';
import { useSearchQueryParams } from '@/features/search/hooks';

const { Header } = Layout;

// dummy theme variable; in the future this could be used to do a 'dark mode' in combination with Ant's support
const THEME: 'light' | 'dark' = 'light';

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

type OnClick = MenuProps['onClick'];
type SiteHeaderProps = {
  menuItems?: MenuItem[];
};

const useHandleMenuClick = (): OnClick => {
  const navigate = useNavigate();
  const location = useLocation();
  const overviewQueryParams = useSearchQueryParams();

  return useCallback(
    ({ key }: { key: string }) => {
      const currentPath = location.pathname.split('/').filter(Boolean);
      const newPath = [currentPath[0]];
      if (!TOP_LEVEL_ONLY_ROUTES.includes(key)) {
        // Beacon network only works at the top scope level
        if (currentPath[1] === 'p') {
          newPath.push('p', currentPath[2]);
        } else if (currentPath[1] === 'd') {
          newPath.push('d', currentPath[2]);
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
};

const SiteHeader = ({ menuItems }: SiteHeaderProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();
  const currentPage = getCurrentPage(location);
  const navigateToRoot = useNavigateToRoot();

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  useEffect(() => {
    document.title = CLIENT_NAME && CLIENT_NAME.trim() ? `Bento: ${CLIENT_NAME}` : 'Bento';
  }, []);

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[i18n.language];
    // Can't rely on there being a trailing slash at the base page (.e.g, `/en` and `/en`/ are both valid), and can't
    // ensure project IDs don't begin with an `en` or `fr`. Thus, we use a RegExp with a `^` for language changing in
    // the URL.
    const path = (location.pathname + location.search).replace(new RegExp(`^/${i18n.language}`), `/${newLang}`);
    navigate(path, { replace: true });
  };

  const logo = `/public/assets/branding${THEME === 'light' ? '.lightbg' : ''}.png`;

  const handleMenuClick = useHandleMenuClick();

  return (
    <Header
      id="site-header"
      className={THEME}
      style={{ backgroundColor: colorBgContainer, borderBottom: `1px solid ${colorBorderSecondary}` }}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={isSmallScreen ? 'small' : 'middle'} className="flex-1">
          {isSmallScreen ? (
            <object
              type="image/png"
              data={logo}
              aria-hidden
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingRight: '26px' }}
              onClick={navigateToRoot}
            >
              <img
                src={logo}
                alt="logo"
                aria-hidden
                style={{
                  height: '32px',
                  verticalAlign: 'middle',
                  transform: 'translateY(-3px)',
                  paddingLeft: '23px',
                }}
                onClick={navigateToRoot}
              />
            </object>
          ) : (
            <img
              src={logo}
              alt="logo"
              aria-hidden
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingLeft: '4px' }}
              onClick={navigateToRoot}
            />
          )}
          {/* If SHOW_HEADER_TITLE is false, assume we have text in the logo. We should still have some kind of level-1
              header for accessibility/semantic markup, so render it but visually hidden in this case. */}
          <Typography.Title
            level={1}
            type="secondary"
            className={SHOW_HEADER_TITLE ? '' : 'visually-hidden'}
            style={{ whiteSpace: 'nowrap' }}
          >
            {CLIENT_NAME}
          </Typography.Title>
          {(menuItems?.length ?? 0) > 1 ? (
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[currentPage]}
              onClick={handleMenuClick}
              className="flex-1"
            />
          ) : null}
        </Flex>

        <Space size={isSmallScreen ? 4 : 'small'}>
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
              {isSmallScreen ? null : (
                <>
                  {t('Portal')} <ExportOutlined />
                </>
              )}
            </Button>
          )}
          {SHOW_SIGN_IN &&
            (isAuthenticated ? (
              <Button
                color="default"
                className="header-button"
                icon={<LogoutOutlined />}
                shape="round"
                variant="filled"
                onClick={performSignOut}
              >
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
