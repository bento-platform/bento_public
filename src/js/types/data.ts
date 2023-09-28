import { ChartConfig } from '@/types/chartConfig';
import { OverviewResponseDataField } from '@/types/overviewResponse';

export type Sections = Section[];

export type Section = {
  sectionTitle: string;
  charts: ChartDataField[];
};

/*
ChartDataField represents a compound object which holds information about a chart's configuration, the relevant data
(mapped to a chart-compatible format), and the field descriptor - the field from which this data was selected.

This represents a chart's "state", since it also has the isDisplayed property - whether the chart is shown.
 */
export interface ChartDataField {
  id: string; // taken from field definition
  data: ChartData[];
  isDisplayed: boolean;
  // Field definition without data (we have mapped data in the data prop above instead):
  field: Omit<OverviewResponseDataField, 'data'>;
  chartConfig: ChartConfig;
}

export interface ChartData {
  x: string;
  y: number;
}

export type LocalStorageData = {
  [key in string]: { id: string; isDisplayed: boolean }[];
};
