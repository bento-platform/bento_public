import type { Field } from '@/types/discovery/fieldDefinition';

export type QueryFilterField = { id: string; options: string[] };

export type QueryParamEntry = [string, string];
export type QueryParams = { [key: string]: string };

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
  study_type?: string;
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
