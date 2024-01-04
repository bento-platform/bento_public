import { ChartTheme, HexColor } from 'bento-charts';

export const COUNTS_FILL = '#75787a';

export const LOCALSTORAGE_CHARTS_KEY = 'charts';

export const CHART_HEIGHT = 350;
export const PIE_CHART_HEIGHT = 300; // rendered slightly smaller since labels can clip
export const DEFAULT_CHART_WIDTH = 1;

export const CHART_COLORS: HexColor[] = ['#F94144', '#F3722C', '#F8961E', '#F9C74F', '#90BE6D', '#2D9CDB'];

export const CHART_THEME = {
  pie: {
    default: {
      fill: CHART_COLORS,
      other: '#75787a',
    },
  },
  bar: {
    default: {
      fill: CHART_COLORS,
      other: '#75787a',
    },
  },
} as ChartTheme;
