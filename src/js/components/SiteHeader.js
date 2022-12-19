import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Layout, Row, Col, Typography, Space } from 'antd';
const { Header } = Layout;
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import bentoLogo from '../../public/assets/bento.svg';

const SiteHeader = () => {
  const { t } = useTranslation();

  const clientName = useSelector((state) => state.config.clientName);
  useEffect(() => {
    document.title = (clientName && clientName.trim()) ? `Bento: ${clientName}` : "Bento";
  }, [clientName]);

  const [language, setLanguage] = useState(i18n.language);
  const changeLanguage = () => {
    i18n.changeLanguage(language === 'en' ? 'fr' : 'en').catch(console.error);
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const portalUrl = useSelector((state) => state.config.portalUrl);

  const buttonHandler = () => window.open(portalUrl, '_blank');

  // noinspection HtmlUnknownTarget
  return (
    <Header style={{ backgroundColor: '#fff' }}>
      <Row align="middle" justify="space-between" style={{height: "64px"}}>
        <Col style={{height: "100%"}}>
          <Space align="start" size={20}>
            <img style={{ marginTop: '15px', height: '32px' }} src="/public/assets/branding.png" alt="logo" />
            <Typography.Title level={1} style={{fontSize: "18px", margin: 0, lineHeight: "64px"}} type="secondary">
              {clientName}
            </Typography.Title>
          </Space>
        </Col>
        <Col style={{height: "100%"}}>
          <Space>
            <Button shape="round" onClick={changeLanguage}>
              {language}
            </Button>
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
