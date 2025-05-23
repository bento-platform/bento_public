import type { ChartConfig } from '@/types/chartConfig';
import type { Field } from '@/features/search/types';

export interface OverviewResponse {
  overview: Overview;
}

export interface Overview {
  counts: CountsOrBooleans;
  fields: Fields;
  layout: Layout[];
}

// If boolean, it means we have data above the threshold but don't have permissions to view the exact count.
export type CountsOrBooleans = {
  individual: number | boolean;
  biosample: number | boolean;
  experiment: number | boolean;
};

export type Fields = {
  [key in string]: OverviewResponseDataField;
};

export interface OverviewResponseDataField {
  data: Datum[];
  definition: Field;
}

export interface Datum {
  label: string;
  value: number;
}

export interface Layout {
  charts: ChartConfig[];
  section_title: string;
}
