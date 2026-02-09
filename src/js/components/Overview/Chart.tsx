import { memo } from 'react';
import { BarChart, Histogram, PieChart } from 'bento-charts';
import { ChoroplethMap } from 'bento-charts/dist/maps';

import { useTranslationFn } from '@/hooks';
import { useNavigateToSameScopeUrl } from '@/hooks/navigation';

import type { CartesianChartProps } from 'recharts/types/util/types';
import type { ChartData } from '@/types/data';
import type { ChartConfig } from '@/types/discovery/chartConfig';

import { CHART_HEIGHT, PIE_CHART_HEIGHT } from '@/constants/overviewConstants';
import {
  CHART_TYPE_BAR,
  CHART_TYPE_CHOROPLETH,
  CHART_TYPE_HISTOGRAM,
  CHART_TYPE_PIE,
} from '@/types/discovery/chartConfig';

import { noop } from '@/utils/chart';

interface PieChartEvent {
  payload: { name: string; id?: string };
}

const Chart = memo(({ chartConfig, data, units, id, isClickable }: ChartProps) => {
  const t = useTranslationFn();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

  const translateMap = ({ x, y }: { x: string; y: number }) => ({ x: t(x), y, id: x });
  const removeMissing = ({ x }: { x: string }) => x !== 'missing';

  const goToSearch = (id: string, val: string | number | undefined) => {
    if (val === undefined) return;
    navigateToSameScopeUrl(`overview?${id}=${val}`);
  };

  const barChartOnChartClickHandler: CartesianChartProps['onClick'] = (e) => {
    goToSearch(id, e.activeLabel); // activeLabel is the "value" for filtering (for bar charts)
  };
  const pieChartOnClickHandler = ({ payload }: PieChartEvent) => {
    goToSearch(id, payload?.id ?? payload.name);
  };

  const { chart_type: type } = chartConfig;
  units = t(units); // Units can be a word, like "years". Make sure this word gets translated.

  switch (type) {
    case CHART_TYPE_BAR:
      return (
        <BarChart
          data={data}
          height={CHART_HEIGHT}
          units={units}
          preFilter={removeMissing}
          dataMap={translateMap}
          {...(isClickable
            ? {
                onChartClick: barChartOnChartClickHandler,
                onClick: noop,
              }
            : {})} // The noop is to provide the cursor: pointer style as onChartClick doesn't provide the behavior
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
          removeEmpty={false} // Preserve the histogram's layout by showing empty bins
          {...(isClickable
            ? {
                onChartClick: barChartOnChartClickHandler,
                onClick: noop,
              }
            : {})} // The noop is to provide the cursor: pointer style as onChartClick doesn't provide the behavior
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
            goToSearch(id, d.properties?.[categoryProp]);
          }}
          renderPopupBody={(_f, d) => (
            <>
              {t('Count') + ':'} {(d ?? 0).toString()} {units}
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
