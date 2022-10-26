import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Layout, Row, Col, Typography, Space } from 'antd';
const { Header } = Layout;
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import bentoLogo from '../../public/assets/bento.svg';
import { client } from '../constants/configConstants';

const SiteHeader = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = 'Bento-Public : ' + client;
  }, []);

  const [language, setLanguage] = useState(i18n.language);
  const changeLanguage = () => {
    i18n.changeLanguage(language === 'en' ? 'fr' : 'en');
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  const portalUrl = useSelector((state) => state.config.portalUrl);

  const buttonHandler = () => window.open(portalUrl, '_blank');

  return (
    <Header style={{ backgroundColor: '#fff' }}>
      <Row align="middle">
        <Col span={2}>
          <img style={{ height: '35px' }} src={bentoLogo} alt="logo" />
        </Col>
        <Col span={2}>
          <Typography.Title style={{ marginBottom: '-4px' }} level={4} type="secondary">
            {client}
          </Typography.Title>
        </Col>
        <Col offset={18} span={2}>
          <Space>
            <Button type="primary" onClick={changeLanguage}>
              {language}
            </Button>
            <Button onClick={buttonHandler}>{t('Portal')}</Button>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default SiteHeader;
