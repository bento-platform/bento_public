import React from 'react';
import { Button, Flex, Layout, Typography, Space } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from 'bento-auth-js';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';
import { RiTranslate } from 'react-icons/ri';
import { LinkOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();

  const { isFetching: openIdConfigFetching } = useAppSelector((state) => state.openIdConfiguration);
  const { isHandingOffCodeForToken } = useAppSelector((state) => state.auth);

  const isAuthenticated = useIsAuthenticated();
  const performSignOut = usePerformSignOut();
  const performSignIn = usePerformAuth();

  document.title = CLIENT_NAME && CLIENT_NAME.trim() ? `Bento: ${CLIENT_NAME}` : 'Bento';

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[i18n.language];
    const path = (location.pathname + location.search).replace(`/${i18n.language}/`, `/${newLang}/`);
    navigate(path, { replace: true });
  };

  return (
    <Header style={{ position: 'fixed', width: '100%', zIndex: 100, top: 0 }}>
      <Flex align="center" justify="space-between">
        <Space size="middle">
          <a href="/">
            <img src="/public/assets/branding.png" alt="logo" style={{ height: '32px', verticalAlign: 'middle' }} />
          </a>
          <Typography.Title
            level={1}
            style={{ fontSize: '18px', margin: 0, lineHeight: '64px', color: 'white' }}
            type="secondary"
          >
            {CLIENT_NAME}
          </Typography.Title>
        </Space>

        <Space size="small">
          {TRANSLATED && (
            <Button
              type="text"
              className="header-button"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
            </Button>
          )}
          <Button type="text" className="header-button" icon={<LinkOutlined />} onClick={openPortalWindow}>
            {t('Portal')}
          </Button>
          {isAuthenticated ? (
            <Button type="text" className="header-button" icon={<LogoutOutlined />} onClick={performSignOut}>
              {t('Sign Out')}
            </Button>
          ) : (
            <Button type="primary" shape="round" icon={<LoginOutlined />} onClick={performSignIn}>
              {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : t('Sign In')}
            </Button>
          )}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
