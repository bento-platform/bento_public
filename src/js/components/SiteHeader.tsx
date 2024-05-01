import React, { useMemo } from 'react';
import { Button, Layout, Row, Col, Typography, Space, Cascader } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, usePerformAuth, usePerformSignOut } from 'bento-auth-js';
import { CLIENT_NAME, PORTAL_URL, TRANSLATED } from '@/config';
import { selectDataset, selectProject } from '@/features/metadata/metadata.store';

const openPortalWindow = () => window.open(PORTAL_URL, '_blank');

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isFetching: openIdConfigFetching } = useAppSelector((state) => state.openIdConfiguration);

  const { isHandingOffCodeForToken } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.metadata);
  const scopeOptions = useMemo(() => {
    return projects.map((p) => ({
      value: p.identifier,
      label: p.title,
      children: p.datasets.map((d) => ({
        value: d.identifier,
        label: d.title,
      })),
    }));
  }, [projects]);

  const onScopeChange = (value: (string | number)[]) => {
    if (value) {
      if (value.length > 0) {
        // first value is project
        dispatch(selectProject(value[0] as string));
      }
      if (value.length === 2) {
        // second value is dataset
        dispatch(selectDataset(value[1] as string));
      }
    } else {
      dispatch(selectProject(''));
      dispatch(selectDataset(''));
    }
  };

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
            <a href="/">
              <img style={{ marginTop: '15px', height: '32px' }} src="/public/assets/branding.png" alt="logo" />
            </a>
            <Typography.Title level={1} style={{ fontSize: '18px', margin: 0, lineHeight: '64px' }} type="secondary">
              {CLIENT_NAME}
            </Typography.Title>
            <Cascader options={scopeOptions} onChange={onScopeChange} placeholder="Select Scope" changeOnSelect />
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
