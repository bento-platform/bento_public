import React from 'react';
import MakeChartCard from './MakeChartCard';

const OverviewDisplayData = ({ all_charts }) => {
  return (
    <>
      {all_charts.map((chart) => (
        <MakeChartCard key={chart.name} chart={chart}></MakeChartCard>
      ))}
    </>
  );
};

export default OverviewDisplayData;
