import React from 'react';
import { Button, Layout, Typography, Space, Flex } from 'antd';
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
    <Header>
      <Flex align="center" justify="space-between">
        <Space size="middle">
          <a href="/">
            <img
              src="/public/assets/branding.png"
              alt="logo"
              style={{
                height: '32px',
                verticalAlign: 'middle',
                marginLeft: '-15px',
              }}
            />
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
              ghost
              type="text"
              className="headerButton"
              icon={<RiTranslate style={{ transform: 'translateY(1px)' }} />}
              onClick={changeLanguage}
            >
              {LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
            </Button>
          )}
          <Button ghost type="text" className="headerButton" icon={<LinkOutlined />} onClick={openPortalWindow}>
            {t('Portal')}
          </Button>
          {isAuthenticated ? (
            <Button ghost type="text" className="headerButton" icon={<LoginOutlined />} onClick={performSignOut}>
              {t('Sign Out')}
            </Button>
          ) : (
            // <Button shape="round" type="primary" onClick={() => performAuth(authzEndpoint, CLIENT_ID, AUTH_CALLBACK_URL)}>
            <Button ghost type="text" className="headerButton" icon={<LogoutOutlined />} onClick={performSignIn}>
              {/* {t('Sign In')} */}
              {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : t('Sign In')}
            </Button>
          )}
        </Space>
      </Flex>
    </Header>
  );
};

export default SiteHeader;
