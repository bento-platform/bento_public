import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { Field } from '@/types/discovery/fieldDefinition';
import type { BentoKatsuEntity } from '@/types/entities';
import type { JSONType } from '@/types/json';

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
  identifier?: string;
  description?: string;
  filename?: string; // File name
  url?: string; // File URL
  indices: ExperimentResult['indices'];
  genome_assembly_id?: ExperimentResult['genome_assembly_id'];
  file_format?: ExperimentResult['file_format'];
  data_output_type?: string;
  usage?: string;
  creation_date?: string;
  created_by?: string;
  extra_properties?: JSONType;
  // ---
  experiments: string[];
  phenopacket?: string;
};

export type DiscoveryMatchExperiment = DiscoveryMatchObject & {
  experiment_type: string;
  study_type?: string;
  results: DiscoveryMatchExperimentResult[];
  phenopacket?: string;
};

export type DiscoveryMatchBiosample = DiscoveryMatchObject & {
  individual_id?: string; // Individual ID
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

export type DiscoveryUIHints = {
  entities_with_data: BentoKatsuEntity[];
};
