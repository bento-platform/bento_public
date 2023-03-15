export interface OverviewResponse {
  overview: Overview;
}

export interface Overview {
  counts: Counts;
  fields: Fields;
  layout: Layout[];
}

export interface Counts {
  biosamples: number;
  experiments: number;
  individuals: number;
}

export type Fields = {
  [key in string]: DataField;
};

export type DataField = NumberDataField | StringDataField | DateDataField;

export interface NumberDataField extends BaseDataField {
  config: NumberConfig;
  datatype: 'number';
}

export interface StringDataField extends BaseDataField {
  config: StringConfig;
  datatype: 'string';
}

export interface DateDataField extends BaseDataField {
  config: DateConfig;
  datatype: 'date';
}

export interface NumberConfig {
  bins?: number;
  bin_size?: number;
  maximum?: number;
  minimum?: number;
  taper_left?: number;
  taper_right?: number;
  units?: string;
}

export interface DateConfig {
  bin_by: string;
}

export interface StringConfig {
  enum: string[] | null;
}

export interface BaseDataField {
  data: Datum[];
  description: string;
  id: string;
  mapping: string;
  mapping_for_search_filter?: string;
  title: string;
}

export interface Datum {
  label: string;
  value: number;
}

export interface Layout {
  charts: Chart[];
  section_title: string;
}

export interface Chart {
  chart_type: string;
  field: string;
}
