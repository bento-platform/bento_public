import { type CSSProperties, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Flex, Layout, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { scopeToUrl } from '@/utils/router';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, SHOW_PORTAL_LINK, SHOW_SIGN_IN, TRANSLATED } from '@/config';

const { Header } = Layout;

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useSmallScreen();

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();
  const { scope: scopeObj } = useSelectedScope();

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
    () => navigate(`/${i18n.language}${scopeToUrl(scopeObj)}`),
    [navigate, i18n.language, scopeObj]
  );

  return (
    <Header id="site-header">
      <Flex align="center" justify="space-between">
        <Space size={isSmallScreen ? 'small' : 'middle'}>
          {isSmallScreen ? (
            <object
              type="image/png"
              data="/public/assets/icon_small.png"
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
              style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingLeft: '4px' }}
              onClick={navigateToOverview}
            />
          )}
          <Typography.Title
            level={1}
            style={{ fontSize: '1.5em', margin: 0, lineHeight: 'var(--header-height)', color: 'white' }}
            type="secondary"
          >
            {CLIENT_NAME}
          </Typography.Title>
        </Space>

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
