import { ChoroplethMapProps } from 'bento-charts/dist/maps';

/*
ChartConfig: represents what is stored in the configuration file for describing a chart, without any attached data or
the field metadata (description / mapping information / units / etc.) By using a sum type here, we can optionally
mandate configuration information for certain types of charts.
 */
export type ChartConfig =
  | {
      chart_type: 'pie';
      field: string;
    }
  | {
      chart_type: 'bar';
      field: string;
    }
  | {
      chart_type: 'choropleth';
      field: string;
      category_prop: ChoroplethMapProps['categoryProp'];
      color_mode: ChoroplethMapProps['colorMode'];
      features: ChoroplethMapProps['features'];
      center: ChoroplethMapProps['center'];
      zoom: ChoroplethMapProps['zoom'];
    };
