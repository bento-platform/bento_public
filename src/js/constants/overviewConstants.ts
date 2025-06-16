import type { HexColor } from 'bento-charts';

export const COUNTS_FILL = '#75787a';

export const LOCALSTORAGE_CHARTS_KEY_PREFIX = 'charts_scope-';

export const CHART_HEIGHT = 350;
export const PIE_CHART_HEIGHT = 300; // rendered slightly smaller since labels can clip
export const DEFAULT_CHART_WIDTH = 1;

// 1320px max width: 428*3 + 18*2 = 1320
export const CHART_WIDTH = 428;
export const GRID_GAP = 18;

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
