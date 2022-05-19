import React from 'react';
import { Col } from 'react-bootstrap';
import Chart from './charts/Chart';

const MakeChartCard = ({ chart }) => {
  const props = chart.properties;

  return (
    <Col
      key={chart.name}
      sm={12}
      md={6}
      lg={4}
      xl={4}
      style={{ height: '100%' }}
    >
      <Chart
        chartType={
          props?.type === 'number' || chart.props?.chart === 'bar'
            ? 'bar'
            : 'pie'
        }
        data={chart.data}
        title={props?.title || '-'}
        units={props?.units || undefined}
      />
    </Col>
  );
};

export default MakeChartCard;
