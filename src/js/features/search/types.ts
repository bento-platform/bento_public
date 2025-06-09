import type { Datum } from '@/types/discovery';
import type { Field } from '@/types/discovery/fieldDefinition';

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

export type SearchFieldAndOptions = {
  id: string;
  definition: Field;
  options: string[];
};

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

export type DiscoveryMatchExperimentResult = {
  id: string;
  f?: string;
  url?: string;
  idx: { url: string; format: 'BAI' | 'BGZF' | 'CRAI' | 'CSI' | 'TABIX' | 'TRIBBLE' }[];
};

export type DiscoveryMatchExperiment = {
  id: string;
  r: DiscoveryMatchExperimentResult[];
};

export type DiscoveryMatchBiosample = {
  id: string;
  e: DiscoveryMatchExperiment[];
};

export type DiscoveryMatchPhenopacket = {
  id: string; // Phenopacket ID
  s?: string; // Subject ID
  b: DiscoveryMatchBiosample[]; // Biosample records
};

export type SearchResultsUIPage = 'individuals' | 'charts';
