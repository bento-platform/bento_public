import { memo, useMemo } from 'react';
import { BarChart, Histogram, PieChart } from 'bento-charts';
import { ChoroplethMap } from 'bento-charts/dist/maps';

import { useLanguage, useTranslationFn } from '@/hooks';
import { useNavigateToSameScopeUrl } from '@/hooks/navigation';

import type { BarChartProps } from 'bento-charts';
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
import { formatDateBinKey } from '@/utils/rangeFilterUtils';

interface PieChartEvent {
  payload?: { name: string; id?: string };
}

const Chart = memo(({ chartConfig, data, units, id, isClickable, dateBinned }: ChartProps) => {
  const t = useTranslationFn();
  const language = useLanguage();
  const navigateToSameScopeUrl = useNavigateToSameScopeUrl();

  // For date-binned fields, x is the raw "yyyy-mm" bin key from the API; format it for display, but keep the raw
  // key around as `id` so clicks can submit it as-is (Katsu's filter parser expects "yyyy-mm", not the display label).
  const translateMap = ({ x, y }: { x: string; y: number }) => ({
    x: dateBinned ? formatDateBinKey(x, language) : t(x),
    y,
    id: x,
  });
  const removeMissing = ({ x }: { x: string }) => x !== 'missing';

  // Bar/histogram click events only give us the displayed (possibly locale-formatted) axis label, not the raw bin
  // key, so build a reverse lookup from display label back to raw key rather than re-parsing the formatted string.
  const dateBinKeyByLabel = useMemo(
    () => (dateBinned ? new Map(data.map(({ x }) => [formatDateBinKey(x, language), x])) : null),
    [dateBinned, data, language]
  );

  const goToSearch = (id: string, val: string | number | undefined) => {
    if (val === undefined) return;
    navigateToSameScopeUrl(`overview?${id}=${val}`);
  };

  const barChartOnChartClickHandler: BarChartProps['onChartClick'] = (e) => {
    // activeLabel is the "value" for filtering (for bar charts); for date-binned fields it's the display label
    // (e.g. "Jan 2021"), so it needs to be mapped back to the raw "yyyy-mm" key before being used as a filter.
    const val =
      dateBinKeyByLabel && typeof e.activeLabel === 'string' ? dateBinKeyByLabel.get(e.activeLabel) : e.activeLabel;
    goToSearch(id, val);
  };
  const pieChartOnClickHandler = ({ payload }: PieChartEvent) => {
    if (!payload) return;
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
  dateBinned?: boolean;
}

export default Chart;
