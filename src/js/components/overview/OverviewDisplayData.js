import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col } from 'antd';

import MakeChartCard from './MakeChartCard';
import { disableChart } from '../../features/data/data';

const OverviewDisplayData = ({ section, allCharts }) => {
  const dispatch = useDispatch();

  const orderedCharts = allCharts;

  const onRemoveChart = ({ section, id }) => {
    dispatch(disableChart({ section, id }));
  };

  return (
    <Row>
      <Col span={24}>
        <div className="chart-grid">
          {orderedCharts
            .filter((e) => e.isDisplayed)
            .map((chart) => (
              <MakeChartCard key={chart.name} chart={chart} section={section} onRemoveChart={onRemoveChart} />
            ))}
        </div>
      </Col>
    </Row>
  );
};

export default OverviewDisplayData;
