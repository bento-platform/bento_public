import React from 'react';
import { Button, Layout, Row, Col, Typography, Space } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from 'bento-auth-js';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';

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

  // noinspection HtmlUnknownTarget
  return (
    <Header style={{ backgroundColor: '#fff' }}>
      <Row align="middle" justify="space-between" style={{ height: '64px' }}>
        <Col style={{ height: '100%' }}>
          <Space align="start" size={20}>
            <Typography.Title level={1} style={{ fontSize: '18px', margin: 0, lineHeight: '64px' }} type="secondary">
              {CLIENT_NAME}
            </Typography.Title>
          </Space>
        </Col>
        <Col style={{ height: '100%' }}>
          <Space>
            {TRANSLATED && (
              <Button shape="round" onClick={changeLanguage}>
                {LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
              </Button>
            )}
            <Button shape="round" onClick={openPortalWindow}>
              {t('Portal')}
            </Button>
            {isAuthenticated ? (
              <Button shape="round" onClick={performSignOut}>
                {t('Sign Out')}
              </Button>
            ) : (
              // <Button shape="round" type="primary" onClick={() => performAuth(authzEndpoint, CLIENT_ID, AUTH_CALLBACK_URL)}>
              <Button shape="round" type="primary" onClick={performSignIn}>
                {/* {t('Sign In')} */}
                {openIdConfigFetching || isHandingOffCodeForToken ? t('Loading...') : t('Sign In')}
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default SiteHeader;
