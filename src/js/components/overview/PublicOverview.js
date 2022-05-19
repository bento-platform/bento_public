import React from 'react';
import { Row, Container } from 'react-bootstrap';
import { Divider, Typography } from 'antd';

import { parseData } from '../../utils/DataUtils';

import OverviewDisplayData from './OverviewDisplayData';

const PublicOverview = ({ overview, queryParameterStack }) => {
  const all_charts_obj = { ...overview, ...overview.extra_properties };
  delete all_charts_obj.extra_properties;
  delete all_charts_obj.individuals;

  const all_charts = Object.entries(all_charts_obj).map((item) => ({
    name: item[0],
    data: item[1],
  }));

  all_charts.forEach((chart, index, arr) => {
    arr[index].properties = queryParameterStack.find(
      (e) => e?.key == chart.name
    )?.props?.Item;
  });

  all_charts.forEach((chart, index, arr) => {
    arr[index].data = parseData(chart);
  });

  console.log('data', all_charts);

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
          all_charts={all_charts_obj}
          queryParameterStack={queryParameterStack}
        />
      </Row>
      <Divider />
    </Container>
  );
};

export default PublicOverview;
