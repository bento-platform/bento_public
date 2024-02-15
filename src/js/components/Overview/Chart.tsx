import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart } from 'bento-charts';
import { ChoroplethMap } from 'bento-charts/dist/maps';

import { CHART_HEIGHT, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import { ChartData } from '@/types/data';
import { CHART_TYPE_BAR, CHART_TYPE_CHOROPLETH, CHART_TYPE_PIE, ChartConfig } from '@/types/chartConfig';

const Chart = memo(({ chartConfig, data, units, id }: ChartProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const translateMap = ({ x, y }: { x: string; y: number }) => ({ x: t(x), y });
  const removeMissing = ({ x }: { x: string }) => x !== 'missing';

  const { chart_type: type } = chartConfig;

  switch (type) {
    case CHART_TYPE_BAR:
      return (
        <BarChart
          data={data}
          height={CHART_HEIGHT}
          units={units}
          preFilter={removeMissing}
          dataMap={translateMap}
          onClick={(d) => {
            navigate(`/${i18n.language}/search?${id}=${d.payload.x}`);
          }}
        />
      );
    case CHART_TYPE_PIE:
      return (
        <PieChart
          data={data}
          height={PIE_CHART_HEIGHT}
          preFilter={removeMissing}
          dataMap={translateMap}
          onClick={(d) => {
            navigate(`/${i18n.language}/search?${id}=${d.name}`);
          }}
        />
      );
    case CHART_TYPE_CHOROPLETH: {
      const { category_prop: categoryProp, features, center, zoom, color_mode: colorMode } = chartConfig;
      return (
        <ChoroplethMap
          data={data}
          height={CHART_HEIGHT}
          preFilter={removeMissing}
          dataMap={translateMap}
          categoryProp={categoryProp}
          features={features}
          center={center}
          zoom={zoom}
          colorMode={colorMode}
          onClick={(d) => {
            const val = d.properties?.[categoryProp];
            if (val === undefined) return;
            navigate(`/${i18n.language}/search?${id}=${val}`);
          }}
          renderPopupBody={(_f, d) => (
            <>
              Count: {(d ?? 0).toString()} {units}
            </>
          )}
        />
      );
    }
    default:
      return <p>chart type does not exist</p>;
  }
});

Chart.displayName = 'Chart';

export interface ChartProps {
  chartConfig: ChartConfig;
  data: ChartData[];
  units: string;
  id: string;
}

export default Chart;
