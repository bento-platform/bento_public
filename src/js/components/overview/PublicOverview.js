// Dashboard.js
import React from 'react';
import { Row, Container } from 'react-bootstrap';
import { Divider, Typography } from 'antd';

import OverviewDisplayData from './OverviewDisplayData';

const PublicOverview = ({ overview, queryParameterStack }) => {
  const ep = overview.extra_properties;
  const all_charts = { ...overview, ...ep };
  const something = [
    { name: 'Age', data: overview.age },
    { name: 'Sex', data: overview.sex },
    ...Object.entries(ep).map((item) => ({ name: item[0], data: item[1] })),
  ];

  console.log('something', something);

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
            Individuals: {overview.individuals}
          </Typography.Title>
        </div>
        <OverviewDisplayData
          all_charts={all_charts}
          queryParameterStack={queryParameterStack}
        />
      </Row>
      <Divider />
    </Container>
  );
};

export default PublicOverview;
