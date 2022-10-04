import React from 'react';
import { Typography, Row, Col } from 'antd';

import OverviewDisplayData from './OverviewDisplayData';

const OverviewSection = ({ title, chartData }) => {
  return (
    <Row className="overview-section">
      <Col span={24}>
        <Typography.Title level={3}>{title}</Typography.Title>
        <OverviewDisplayData section={title} allCharts={chartData} />
      </Col>
    </Row>
  );
};

export default OverviewSection;
