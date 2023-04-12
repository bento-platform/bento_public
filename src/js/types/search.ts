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

export interface KatsuSearchResponse {
  status: string;
  biosamples: Biosamples;
  count: number;
  experiments: Experiments;
  message: string;
}

export interface Biosamples {
  count: number;
  sampled_tissue: SampledTissue[];
}

export interface SampledTissue {
  label: string;
  value: number;
}

export interface Experiments {
  count: number;
  experiment_type: SampledTissue[];
}
