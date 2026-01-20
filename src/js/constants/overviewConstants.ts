import type { HexColor } from 'bento-charts';
import type { DashboardChartMode } from '@/features/ui/types';

export const COUNTS_FILL = '#75787a';

export const LOCALSTORAGE_CHARTS_KEY_PREFIX = 'charts_scope-';
export const OLD_LOCALSTORAGE_CHARTS_KEY = 'charts';

export const CHART_DIMENSIONS: Record<
  DashboardChartMode,
  {
    chartHeight: number;
    pieChartHeight: number;
    chartWidth: number;
    gridGap: number;
  }
> = {
  normal: {
    chartHeight: 350,
    pieChartHeight: 275, // rendered slightly smaller since labels can clip
    // 1400px max width: 454*3 + 19*2 = 1399
    chartWidth: 454,
    gridGap: 19,
  },
  compact: {
    chartHeight: 275,
    pieChartHeight: 225,
    // 1400px max width: 350*4 with no gap
    chartWidth: 350,
    gridGap: 0,
  },
  ultraCompact: {
    chartHeight: 250,
    pieChartHeight: 200,
    // 1400px max width: 280*5 with no gap
    chartWidth: 280,
    gridGap: 0,
  },
};

export const DEFAULT_CHART_WIDTH = 1; // Units of grid spaces, i.e., <this> * [mode].chartWidth above

const NEW_CHART_COLORS: HexColor[] = ['#90BE6D', '#F8961E', '#F3722C', '#2D9CDB', '#F94144', '#F9C74F'];
const BAR_CHART_FILL: HexColor = '#2D9CDB';
const CHART_MISSING_FILL: HexColor = '#bbbbbb';

export const NEW_BENTO_PUBLIC_THEME = {
  pie: {
    default: {
      fill: NEW_CHART_COLORS,
      other: CHART_MISSING_FILL,
    },
  },
  bar: {
    default: {
      fill: NEW_CHART_COLORS,
      other: CHART_MISSING_FILL,
    },
  },
  histogram: {
    default: {
      fill: [BAR_CHART_FILL],
      other: CHART_MISSING_FILL,
    },
  },
};
