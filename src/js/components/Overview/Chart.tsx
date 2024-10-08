import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { BarChartProps } from 'bento-charts';
import { BarChart, Histogram, PieChart } from 'bento-charts';
import { ChoroplethMap } from 'bento-charts/dist/maps';

import { CHART_HEIGHT, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import type { ChartData } from '@/types/data';
import type { ChartConfig } from '@/types/chartConfig';
import { CHART_TYPE_BAR, CHART_TYPE_HISTOGRAM, CHART_TYPE_CHOROPLETH, CHART_TYPE_PIE } from '@/types/chartConfig';
import { useAppSelector } from '@/hooks';
import { scopeToUrl } from '@/utils/router';

interface ChartEvent {
  activePayload: Array<{ payload: { x: string } }>;
}

const Chart = memo(({ chartConfig, data, units, id, isClickable }: ChartProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { scope } = useAppSelector((state) => state.metadata.selectedScope);
  const translateMap = ({ x, y }: { x: string; y: number }) => ({ x: t(x), y });
  const removeMissing = ({ x }: { x: string }) => x !== 'missing';

  const barChartOnChartClickHandler: BarChartProps['onChartClick'] = (e: ChartEvent) => {
    if (e.activePayload.length === 0) return;
    const d = e.activePayload[0];
    navigate(`/${i18n.language}${scopeToUrl(scope)}/search?${id}=${d.payload.x}`);
  };
  const pieChartOnClickHandler = (d: { name: string }) => {
    navigate(`/${i18n.language}${scopeToUrl(scope)}/search?${id}=${d.name}`);
  };

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
          {...(isClickable ? { onChartClick: barChartOnChartClickHandler } : {})}
        />
      );
    case CHART_TYPE_HISTOGRAM:
      return (
        <Histogram
          units={units}
          height={CHART_HEIGHT}
          data={data}
          preFilter={removeMissing}
          dataMap={translateMap}
          {...(isClickable ? { onChartClick: barChartOnChartClickHandler } : {})}
        />
      );
    case CHART_TYPE_PIE:
      return (
        <PieChart
          data={data}
          height={PIE_CHART_HEIGHT}
          preFilter={removeMissing}
          dataMap={translateMap}
          onClick={pieChartOnClickHandler}
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
  isClickable: boolean;
}

export default Chart;
