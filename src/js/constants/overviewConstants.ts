import type { HexColor } from 'bento-charts';
import { ChartSizeMode } from '@/features/ui/types';

export const COUNTS_FILL = '#75787a';

export const LOCALSTORAGE_CHARTS_KEY_PREFIX = 'charts_scope-';

export const CHART_HEIGHT = 350;
export const PIE_CHART_HEIGHT = 300; // rendered slightly smaller since labels can clip
export const DEFAULT_CHART_WIDTH = 1;

// 1400px max width: 454*3 + 19*2 = 1399
export const CHART_WIDTH = 454;
export const GRID_GAP = 12;

// pie charts are rendered slightly smaller since labels can clip
export const CHART_SIZES: Record<
  ChartSizeMode,
  { minWidth: number; gridGap: number; chartHeight: number; pieChartHeight: number }
> = {
  normal: {
    minWidth: 350,
    gridGap: 12,
    chartHeight: 350,
    pieChartHeight: 300,
  },
  compact: {
    minWidth: 300,
    gridGap: 1,
    chartHeight: 300,
    pieChartHeight: 265,
  },
};

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
