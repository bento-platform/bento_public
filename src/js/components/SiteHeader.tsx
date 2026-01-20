import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Flex, Layout, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAuthState, useIsAuthenticated, useOpenIdConfig, usePerformAuth, usePerformSignOut } from 'bento-auth-js';

import { RiTranslate } from 'react-icons/ri';
import { ExportOutlined, LinkOutlined, LoginOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';

import { useSelectedScope } from '@/features/metadata/hooks';
import { useSmallScreen } from '@/hooks/useResponsiveContext';
import { langAndScopeSelectionToUrl } from '@/utils/router';

import { LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { CLIENT_NAME, PORTAL_URL, SHOW_PORTAL_LINK, SHOW_SIGN_IN, TRANSLATED } from '@/config';
import SettingsModal from '@/components/SettingsModal';
import { useChangeLanguage } from '@/hooks/navigation';

const { Header } = Layout;

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isSmallScreen = useSmallScreen();

  const { isFetching: openIdConfigFetching } = useOpenIdConfig();
  const { isHandingOffCodeForToken } = useAuthState();
  const selectedScope = useSelectedScope();

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  document.title = CLIENT_NAME && CLIENT_NAME.trim() ? `Bento: ${CLIENT_NAME}` : 'Bento';

  const changeLanguage = useChangeLanguage();

  const navigateToOverview = useCallback(
    () => navigate(langAndScopeSelectionToUrl(i18n.language, selectedScope, '')),
    [navigate, i18n.language, selectedScope]
  );

  return (
    <>
      <Header id="site-header">
        <Flex align="center" justify="space-between">
          <Space size={isSmallScreen ? 'small' : 'middle'}>
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
                style={{ height: '32px', verticalAlign: 'middle', transform: 'translateY(-3px)', paddingLeft: '4px' }}
                onClick={navigateToOverview}
              />
            )}
            <Typography.Title level={1} type="secondary">
              {CLIENT_NAME}
            </Typography.Title>
          </Space>

          <Space size={isSmallScreen ? 0 : 'small'}>
            <Button
              type="text"
              className="header-button"
              icon={<SettingOutlined />}
              onClick={() => setSettingsOpen(true)}
            >
              {isSmallScreen ? '' : t('settings.settings')}
            </Button>
            {TRANSLATED && (
              <Button
                type="text"
                className="header-button"
                icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
                onClick={() => changeLanguage()}
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
                  {openIdConfigFetching || isHandingOffCodeForToken
                    ? t('Loading...')
                    : isSmallScreen
                      ? ''
                      : t('Sign In')}
                </Button>
              ))}
          </Space>
        </Flex>
      </Header>
      <SettingsModal open={settingsOpen} onCancel={() => setSettingsOpen(false)} />
    </>
  );
};

export default SiteHeader;
