import React from 'react';
import BentoBarChart from './BentoBarChart';
import BentoPie from './BentoPie';

const CHART_HEIGHT = 300;

const Chart = ({ chartType, data, title, units }) => {
  const renderChartSwitch = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BentoBarChart data={data} height={CHART_HEIGHT} units={units} />
        );
      case 'pie':
        return <BentoPie data={data} height={CHART_HEIGHT} />;
      default:
        return <p>chart type doesnt exists</p>;
    }
  };

  return <>{renderChartSwitch()}</>;
};

export default Chart;
