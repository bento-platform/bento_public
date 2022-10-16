import React from 'react';
import { Typography, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

import OverviewDisplayData from './OverviewDisplayData';

const OverviewSection = ({ title, chartData }) => {
  const { t } = useTranslation();

  return (
    <Row className="overview-section">
      <Col span={24}>
        <Typography.Title level={3}>{t(title)}</Typography.Title>
        <OverviewDisplayData section={title} allCharts={chartData} />
      </Col>
    </Row>
  );
};

export default OverviewSection;
