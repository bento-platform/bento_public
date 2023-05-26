import React, { useEffect } from 'react';
import { Button, Layout, Row, Col, Typography, Space } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES, SUPPORTED_LNGS } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();

  const clientName = useAppSelector((state) => state.config.clientName);
  const translated = useAppSelector((state) => state.config.translated);
  const portalUrl = useAppSelector((state) => state.config.portalUrl);

  useEffect(() => {
    document.title = clientName && clientName.trim() ? `Bento: ${clientName}` : 'Bento';
  }, [clientName]);

  const changeLanguage = () => {
    const newLang = LNG_CHANGE[i18n.language];
    const path = (location.pathname + location.search).replace(`/${i18n.language}/`, `/${newLang}/`);
    navigate(path, { replace: true });
  };

  const buttonHandler = () => window.open(portalUrl, '_blank');

  // noinspection HtmlUnknownTarget
  return (
    <Header style={{ backgroundColor: '#fff' }}>
      <Row align="middle" justify="space-between" style={{ height: '64px' }}>
        <Col style={{ height: '100%' }}>
          <Space align="start" size={20}>
            <img style={{ marginTop: '15px', height: '32px' }} src="/public/assets/branding.png" alt="logo" />
            <Typography.Title level={1} style={{ fontSize: '18px', margin: 0, lineHeight: '64px' }} type="secondary">
              {clientName}
            </Typography.Title>
          </Space>
        </Col>
        <Col style={{ height: '100%' }}>
          <Space>
            {translated && (
              <Button shape="round" onClick={changeLanguage}>
                {LNGS_FULL_NAMES[LNG_CHANGE[i18n.language]]}
              </Button>
            )}
            <Button type="primary" shape="round" onClick={buttonHandler}>
              {t('Portal')}
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default SiteHeader;
