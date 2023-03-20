import { OverviewResponseDataField } from '@/types/OverviewResponse.interface';

export type Sections = Section[];

export type Section = {
  sectionTitle: string;
  charts: ChartDataField[];
};

export interface ChartDataField extends Omit<OverviewResponseDataField, 'data'> {
  data: ChartData[];
  isDisplayed: boolean;
  chartType: ChartType;
}

export interface ChartData {
  x: string;
  y: number;
}

export type ChartType = 'bar' | 'pie';

export type LocalStorageData = {
  [key in string]: { id: string; isDisplayed: boolean }[];
};
