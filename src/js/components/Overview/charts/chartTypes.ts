export interface ChartDataType extends Array<ChartDataItem> {}

export interface ChartDataItem {
  x: string;
  y: number;
}

export interface TooltipPayload extends Array<TooltipPayloadItem> {}

interface TooltipPayloadItem {
  name: string;
  payload: {
    x: string;
  };
  value: number;
}

export type HexColor = `#${string}`;

export type ChartTheme = {
  pie: {
    [key in string]: HexColor[];
  } & {
    default: HexColor[];
  };
  bar: {
    [key in string]: { fill: HexColor; missing: HexColor };
  } & {
    default: { fill: HexColor; missing: HexColor };
  };
};

export type FilterCallback<T> = (value: T, index: number, array: T[]) => boolean;
export type UnitaryMapCallback<T> = (value: T, index: number, array: T[]) => T;
// export type BinaryMapCallback<T, U> = (value: T, index: number, array: T[]) => U;

export type ChartFilterCallback = FilterCallback<ChartDataItem>;

export type SupportedLng = 'en' | 'fr';

type TranslationWords = 'Count' | 'Other';

export type LngDictionary = {
  [key in TranslationWords]: string;
};

export type TranslationObject = {
  [key in SupportedLng]: LngDictionary;
};
