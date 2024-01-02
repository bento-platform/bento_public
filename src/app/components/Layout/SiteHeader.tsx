import React from 'react';
import { Button, Layout, Row, Col, Typography, Space, Breadcrumb } from 'antd';
const { Header } = Layout;
import { useTranslation } from 'react-i18next';
import { DEFAULT_TRANSLATION, LNG_CHANGE, LNGS_FULL_NAMES } from '@/constants/configConstants';
import { useAppSelector } from '@/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { DatabaseOutlined, HomeOutlined } from '@ant-design/icons';

const ProjectItems = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer">
        Project 1
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer">
        Project 2
      </a>
    ),
  },
];

const SiteHeader = () => {
  const { t, i18n } = useTranslation(DEFAULT_TRANSLATION);
  const navigate = useNavigate();
  const location = useLocation();

  const clientName = useAppSelector((state) => state.config.clientName);
  const translated = useAppSelector((state) => state.config.translated);
  const portalUrl = useAppSelector((state) => state.config.portalUrl);

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
          <Space align="center" size={20}>
            <Typography.Title level={1} style={{ fontSize: '18px', margin: 0, lineHeight: '64px' }} type="secondary">
              {clientName}
            </Typography.Title>
            <Breadcrumb
              items={[
                {
                  title: <HomeOutlined />,
                },
                {
                  title: (
                    <>
                      <DatabaseOutlined />
                      <span>Project</span>
                    </>
                  ),
                  menu: { items: ProjectItems },
                },
                {
                  title: 'Dataset',
                },
              ]}
            />
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
