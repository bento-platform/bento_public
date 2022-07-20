import React from 'react';
import OverviewDisplayData from './OverviewDisplayData';
import { Typography } from 'antd';
const { Title } = Typography;

const OverviewSection = ({ index, title, chartData }) => {
  const style = index ? { marginTop: '40px' } : {};

  return (
    <>
      <Title level={3} style={style}>
        {title}
      </Title>
      <OverviewDisplayData section={title} allCharts={chartData} />
    </>
  );
};

export default OverviewSection;
