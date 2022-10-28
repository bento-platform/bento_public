import React from 'react';
import { useDispatch } from 'react-redux';
import { Row, Col, Space } from 'antd';

import MakeChartCard from './MakeChartCard';
import { disableChart } from '../../features/data/data';

const OverviewDisplayData = ({ section, allCharts }) => {
  const dispatch = useDispatch();

  const orderedCharts = allCharts;

  const onRemoveChart = ({ section, id }) => {
    dispatch(disableChart({ section, id }));
  };

  return (
    <Row justify="center">
      <Col span={24}>
        <Space size={[15, 15]} wrap>
          {orderedCharts
            .filter((e) => e.isDisplayed)
            .map((chart) => (
              <MakeChartCard key={chart.name} chart={chart} section={section} onRemoveChart={onRemoveChart} />
            ))}
        </Space>
      </Col>
    </Row>
  );
};

export default OverviewDisplayData;
