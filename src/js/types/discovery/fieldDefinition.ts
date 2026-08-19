// See also: See https://github.com/bento-platform/bento_lib/blob/master/bento_lib/discovery/models/fields.py

type BaseField = {
  title: string;
  description: string;
  datatype: 'number' | 'string' | 'date';
  mapping: string;
  mapping_for_search_filter?: string | null;
  group_by?: string | null;
  group_by_value?: string | null;
  value_mapping?: string | null;
};

type BaseNumberFieldConfig = {
  units?: string | null;
};

export type ManualBinsNumberFieldConfig = BaseNumberFieldConfig & {
  bins: number[];
  minimum?: number | null;
  maximum?: number | null;
};

export type AutoBinsNumberFieldConfig = BaseNumberFieldConfig & {
  bin_size: number;
  taper_left: number;
  taper_right: number;
  minimum: number;
  maximum: number;
};

export type NumberFieldConfig = ManualBinsNumberFieldConfig | AutoBinsNumberFieldConfig;

export type NumberField = BaseField & {
  datatype: 'number';
  config: NumberFieldConfig;
};

export type StringFieldConfig = {
  enum: string[] | null;
};

export type StringField = BaseField & {
  datatype: 'string';
  config: StringFieldConfig;
};

export type DateFieldConfig = {
  bin_by: 'month';
};

export type DateField = BaseField & {
  datatype: 'date';
  config: DateFieldConfig;
};

export type Field = NumberField | StringField | DateField;
