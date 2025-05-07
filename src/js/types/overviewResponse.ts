import type { ChartConfig } from '@/types/chartConfig';
import type { BentoEntity } from '@/types/entities';

export interface OverviewResponse {
  overview: Overview;
}

export interface Overview {
  counts: CountsOrBooleans;
  fields: Fields;
  layout: Layout[];
}

// If boolean, it means we have data above the threshold but don't have permissions to view the exact count.
export type CountsOrBooleans = Record<BentoEntity, number | boolean>;

export type Fields = {
  [key in string]: OverviewResponseDataField;
};

export interface OverviewResponseDataField {
  data: Datum[];
  config: Config;
  datatype: 'number' | 'string' | 'date';
  description: string;
  id: string;
  mapping: string;
  mapping_for_search_filter?: string;
  title: string;
}

export interface Config {
  bins?: number;
  bin_size?: number;
  maximum?: number;
  minimum?: number;
  taper_left?: number;
  taper_right?: number;
  units?: string;
  bin_by: string;
  enum: string[] | null;
}

export interface Datum {
  label: string;
  value: number;
}

export interface Layout {
  charts: ChartConfig[];
  section_title: string;
}
