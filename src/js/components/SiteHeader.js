import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Layout, Row, Col, Typography } from 'antd';
const { Header } = Layout;

import bentoLogo from '../../assets/bento.svg';
import { client } from '../constants/configConstants';

const SiteHeader = () => {
  useEffect(() => {
    document.title = 'Bento-Public : ' + client;
  }, []);

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
        <Col offset={19} span={1}>
          <Button onClick={buttonHandler}>Portal</Button>
        </Col>
      </Row>
    </Header>
  );
};

export default SiteHeader;
