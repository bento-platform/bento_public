import React from 'react';
import { useTranslation } from 'react-i18next';
import { chartTypes } from '../../constants/overviewConstants';
import { BarChart, PieChart } from 'bento-charts';

import { CHART_HEIGHT } from '../../constants/overviewConstants';

const Chart = ({ chartType, data, units }) => {
  const { t } = useTranslation();
  const translateMap = ({ x, y }) => ({ x: t(x), y });
  const removeMissing = ({ x }) => x !== 'missing';

  const renderChartSwitch = () => {
    switch (chartType) {
      case chartTypes.BAR:
        // bar charts can be rendered slightly larger as they do not clip
        return (
          <BarChart
            data={data}
            height={CHART_HEIGHT + 30}
            units={units}
            preFilter={removeMissing}
            dataMap={translateMap}
          />
        );
      case chartTypes.PIE:
        return <PieChart data={data} height={CHART_HEIGHT} preFilter={removeMissing} dataMap={translateMap} />;
      default:
        return <p>chart type doesnt exists</p>;
    }
  };

  return <>{renderChartSwitch()}</>;
};

export default Chart;
