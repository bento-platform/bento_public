import { ChoroplethMapProps } from 'bento-charts/dist/maps';

// Use multiple literals here instead of an object for full immutability.
export const CHART_TYPE_PIE = 'pie';
export const CHART_TYPE_BAR = 'bar';
export const CHART_TYPE_CHOROPLETH = 'choropleth';

/*
ChartConfig: represents what is stored in the configuration file for describing a chart, without any attached data or
the field metadata (description / mapping information / units / etc.) By using a sum type here, we can optionally
mandate configuration information for certain types of charts.
 */

interface BaseChartConfig {
  field: string;
  width?: number;
}

interface ChartConfigPie extends BaseChartConfig {
  chart_type: typeof CHART_TYPE_PIE;
}

interface ChartConfigBar extends BaseChartConfig {
  chart_type: typeof CHART_TYPE_BAR;
}

interface ChartConfigChoropleth extends BaseChartConfig {
  chart_type: typeof CHART_TYPE_CHOROPLETH;
  category_prop: ChoroplethMapProps['categoryProp'];
  color_mode: ChoroplethMapProps['colorMode'];
  features: ChoroplethMapProps['features'];
  center: ChoroplethMapProps['center'];
  zoom: ChoroplethMapProps['zoom'];
}

export type ChartConfig = ChartConfigPie | ChartConfigBar | ChartConfigChoropleth;
