import React from 'react';
import { Row, Container } from 'react-bootstrap';
import { Divider, Typography } from 'antd';

import { useSelector } from 'react-redux';

import OverviewDisplayData from './OverviewDisplayData';

const PublicOverview = () => {
  const { chartData, individuals } = useSelector((state) => state.data);

  return (
    <Container>
      <Row>
        <div
          style={{
            textAlign: 'right',
            transform: 'translateY(-80px)',
            color: '#AAA',
          }}
        >
          <Typography.Title level={5}>
            Individuals: {individuals}
          </Typography.Title>
        </div>
        <OverviewDisplayData allCharts={chartData} />
      </Row>

      <Divider />
    </Container>
  );
};

export default PublicOverview;
