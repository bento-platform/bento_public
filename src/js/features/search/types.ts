import type { ExternalLink } from '@/types/clinPhen/shared';
import type { Experiment } from '@/types/clinPhen/experiments/experiment';
import type { ExperimentResult } from '@/types/clinPhen/experiments/experimentResult';
import type { Field } from '@/types/discovery/fieldDefinition';
import type { BentoKatsuEntity } from '@/types/entities';
import type { JSONType } from '@/types/json';

export type FtsQueryType = 'plain' | 'phrase' | 'websearch' | 'trigram';

export type { QueryParamEntry, QueryParamEntries } from '@/utils/queryParams';

export type FilterValue = string | string[] | null;
export type FiltersState = Record<string, FilterValue>;

export interface SearchFieldResponse {
  sections: SearchFieldSection[];
}

export interface SearchFieldSection {
  fields: SearchFieldAndOptions[];
  section_title: string;
}

export type SearchFieldAndOptions = { id: string; options: string[]; definition: Field };

export type KatsuIndividualMatch = {
  id: string;
  phenopacket_id: string | null;
  project_id: string | null;
  dataset_id: string | null;
};

export type DiscoveryMatchObject = {
  id: string | number; // Entity ID
  project?: string | null;
  dataset?: string | null;
};

export type DiscoveryMatchExperimentResult = DiscoveryMatchObject & {
  id: number;
  identifier?: string;
  description?: string;
  filename?: string; // File name
  url?: string; // File URL
  indices?: ExperimentResult['indices'];
  genome_assembly_id?: ExperimentResult['genome_assembly_id'];
  file_format?: ExperimentResult['file_format'];
  data_output_type?: string;
  usage?: string;
  creation_date?: string;
  created_by?: string;
  links?: ExternalLink[];
  extra_properties?: JSONType;
  // ---
  experiments: string[];
  phenopacket?: string;
};

export type MatchIncludedFieldsFromExperiments =
  'id' | 'description' | 'experiment_type' | 'experiment_ontology' | 'study_type' | 'molecule' | 'molecule_ontology';
export type DiscoveryMatchExperiment = DiscoveryMatchObject &
  Pick<Experiment, MatchIncludedFieldsFromExperiments> & {
    results: DiscoveryMatchExperimentResult[];
    links?: ExternalLink[];
    biosample?: string;
    phenopacket?: string;
  };

export type DiscoveryMatchBiosample = DiscoveryMatchObject & {
  id: string;
  individual_id?: string; // Individual ID
  phenopacket?: string; // Phenopacket ID
  links?: ExternalLink[];
  experiments: DiscoveryMatchExperiment[];
};

export type DiscoveryMatchPhenopacket = DiscoveryMatchObject & {
  id: string;
  subject?: string; // Subject ID
  links?: ExternalLink[];
  biosamples: DiscoveryMatchBiosample[]; // Biosample records
};

export type DiscoveryMatchIndividual = DiscoveryMatchObject & {
  id: string; // Individual ID
  links?: ExternalLink[];
  biosamples: DiscoveryMatchBiosample[]; // All of the individual's biosamples (also nested under phenopackets)
  phenopackets: DiscoveryMatchPhenopacket[];
};

export type ViewableDiscoveryMatchObject =
  DiscoveryMatchBiosample | DiscoveryMatchExperiment | DiscoveryMatchIndividual | DiscoveryMatchExperimentResult;

export type SearchResultsUIPage = 'individuals' | 'charts';

export type DiscoveryUIHints = {
  entities_with_data: BentoKatsuEntity[];
};
