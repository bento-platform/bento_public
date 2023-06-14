import React from 'react';
import { useTranslation } from 'react-i18next';
import { chartTypes } from '@/constants/overviewConstants';
import { BarChart, PieChart } from 'bento-charts';

import { CHART_HEIGHT } from '@/constants/overviewConstants';
import { ChartData } from '@/types/data';
import { useNavigate, useLocation } from 'react-router-dom';

const Chart = ({ chartType, data, units, id }: ChartProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const translateMap = ({ x, y }: { x: string; y: number }) => ({ x: t(x), y });
  const removeMissing = ({ x }: { x: string }) => x !== 'missing';

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
            onClick={(d) => {
              navigate(`${location.pathname.slice(0, 3)}/search?${id}=${d.payload.x}`);
            }}
          />
        );
      case chartTypes.PIE:
        return (
          <PieChart
            data={data}
            height={CHART_HEIGHT}
            preFilter={removeMissing}
            dataMap={translateMap}
            onClick={(d) => {
              navigate(`${location.pathname.slice(0, 3)}/search?${id}=${d.name}`);
            }}
          />
        );
      default:
        return <p>chart type doesnt exists</p>;
    }
  };

  return <>{renderChartSwitch()}</>;
};

export interface ChartProps {
  chartType: string;
  data: ChartData[];
  units: string;
  id: string;
}

export default Chart;
