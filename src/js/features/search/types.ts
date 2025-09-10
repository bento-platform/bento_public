import type { Datum } from '@/types/discovery';
import type { Field } from '@/types/discovery/fieldDefinition';

export type QueryFilterField = { id: string; options: string[] };

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

export type SearchFieldAndOptions = QueryFilterField & { definition: Field };

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

export type DiscoveryMatchObject = {
  id: string; // Entity ID
  project?: string | null;
  dataset?: string | null;
};

export type DiscoveryMatchExperimentResult = DiscoveryMatchObject & {
  filename?: string; // File name
  url?: string; // File URL
  indices: { url: string; format: 'BAI' | 'BGZF' | 'CRAI' | 'CSI' | 'TABIX' | 'TRIBBLE' }[];
  file_format?: string;
  assembly_id?: string;
};

export type DiscoveryMatchExperiment = DiscoveryMatchObject & {
  results: DiscoveryMatchExperimentResult[];
};

export type DiscoveryMatchBiosample = DiscoveryMatchObject & {
  phenopacket?: string; // Phenopacket ID
  experiments: DiscoveryMatchExperiment[];
};

export type DiscoveryMatchPhenopacket = DiscoveryMatchObject & {
  subject?: string; // Subject ID
  biosamples: DiscoveryMatchBiosample[]; // Biosample records
};

export type ViewableDiscoveryMatchObject =
  | DiscoveryMatchBiosample
  | DiscoveryMatchExperiment
  | DiscoveryMatchPhenopacket
  | DiscoveryMatchExperimentResult;

export type SearchResultsUIPage = 'individuals' | 'charts';
