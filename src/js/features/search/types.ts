import type { Datum } from '@/types/overviewResponse';

export type QueryParamEntry = [string, string];
export type QueryParams = { [key: string]: string };

export interface SearchFieldResponse {
  sections: Section[];
}

export interface Section {
  fields: Field[];
  section_title: string;
}

export interface Field {
  config: Config;
  datatype: string;
  description: string;
  id: string;
  mapping: string;
  options: string[];
  title: string;
  mapping_for_search_filter?: string;
}

export interface Config {
  bin_size?: number;
  maximum?: number;
  minimum?: number;
  taper_left?: number;
  taper_right?: number;
  units?: string;
  enum?: null;
}

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

export type SearchResultsUIPane = 'individuals' | 'charts';
