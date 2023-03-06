import CSS from 'csstype';
import { ChartTheme, HexColor, TranslationObject } from './chartTypes';

// Bento-web colours
export const COLORS: HexColor[] = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#8B0707',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];

export const BAR_CHART_FILL = '#4575b4';
export const CHART_MISSING_FILL = '#bbbbbb';

export const DEFAULT_CHART_THEME: ChartTheme = {
  pie: {
    default: COLORS,
  },
  bar: {
    default: {
      fill: BAR_CHART_FILL,
      missing: CHART_MISSING_FILL,
    },
  },
};

export const TOOL_TIP_STYLE: CSS.Properties = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: '5px',
  border: '1px solid grey',
  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.9)',
  borderRadius: '2px',
  textAlign: 'left',
};

export const LABEL_STYLE: CSS.Properties = {
  fontWeight: 'bold',
  fontSize: '12px',
  padding: '0',
  margin: '0',
};

export const COUNT_STYLE: CSS.Properties = {
  fontWeight: 'normal',
  fontSize: '11px',
  padding: '0',
  margin: '0',
};

export const CHART_WRAPPER_STYLE: CSS.Properties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const OTHER_THRESHOLD = 0.01; //

export const defaultTranslationObject: TranslationObject = {
  en: {
    Count: 'Count',
    Other: 'Other',
  },
  fr: {
    Count: 'Comptage',
    Other: 'Autre',
  },
};
