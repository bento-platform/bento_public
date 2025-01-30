import type { OntologyTerm } from '@/types/clinphen/ontology';
import type { Instrument } from '@/types/clinphen/resources';

type ExperimentResult = {
  id: number;
  identifier: string;
  description: string;
  filename: string;
  url: string;
  genome_assembly_id: string;
  file_format: string;
  data_output_type: string;
  creation_date: string;
  created: string;
  updated: string;
};

export type Experiment = {
  id: string;
  experiment_results?: ExperimentResult[];
  instrument: Instrument;
  biosample_individual: {
    id: string;
  };
  study_type: string;
  experiment_type: string;
  experiment_ontology: OntologyTerm[];
  molecule?: string;
  molecule_ontology?: OntologyTerm[];
  library_strategy?: string;
  library_source?: string;
  library_selection?: string;
  created: string;
  updated: string;
  biosample: string;
  dataset: string;
};
