import type { Datum } from '@/types/overviewResponse';

export type QueryParamEntry = [string, string];
export type QueryParams = { [key: string]: string };

export type QueryMode = 'filters' | 'text';

export interface SearchFieldResponse {
  sections: SearchFieldSection[];
}

export interface SearchFieldSection {
  fields: SearchFieldAndOptions[];
  section_title: string;
}

/* BEGIN DISCOVERY FIELD TYPE DEFINITION -------------------------------------------------------------------------------
 *   See https://github.com/bento-platform/bento_lib/blob/master/bento_lib/discovery/models/fields.py
 */

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

// ----

export type SearchFieldAndOptions = {
  id: string;
  definition: Field;
  options: string[];
};

// END DISCOVERY FIELD TYPE DEFINITION ---------------------------------------------------------------------------------

export type KatsuIndividualMatch = {
  id: string;
  phenopacket_id: string | null;
  project_id: string | null;
  dataset_id: string | null;
};

export type KatsuSearchResponse =
  | {
      biosamples: Biosamples;
      count: number;
      matches?: string[];
      // Below is a temporary detailed match list so we can start building a better search UI.
      matches_detail?: KatsuIndividualMatch[];
      experiments: Experiments;
    }
  | { message: string };

export interface Biosamples {
  count: number;
  sampled_tissue: Datum[];
}

export interface Experiments {
  count: number;
  experiment_type: Datum[];
}

export type SearchResultsUIPage = 'individuals' | 'charts';
