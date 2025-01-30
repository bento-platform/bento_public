import type { OntologyTerm } from './ontology';

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

type Instrument = {
  id: number;
  identifier: string;
  created: string;
  updated: string;
};

type Experiment = {
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

type Biosample = {
  id: string;
  experiments?: Experiment[];
  created: string;
  updated: string;
  sampled_tissue?: {
    id: string;
    label: string;
  };
  procedure?: {
    code: OntologyTerm;
  };
};

type PhenotypicFeature = {
  type: OntologyTerm;
  created: string;
  updated: string;
  excluded: boolean;
  phenopacket: string;
};

type Diagnosis = {
  id: string;
  genomic_interpretations: unknown[];
  disease: unknown | null;
  extra_properties: unknown | null;
};

type Interpretation = {
  id: string;
  created: string;
  updated: string;
  progress_status: string;
  summary: string;
  diagnosis: Diagnosis;
};

type Disease = {
  id: number;
  created: string;
  updated: string;
  term: OntologyTerm;
  excluded: boolean;
};

type MeasurementValue = {
  quantity?: {
    unit: OntologyTerm;
    value: number;
  };
  complex_value?: {
    typed_quantities: {
      type: OntologyTerm;
      quantity: {
        unit: OntologyTerm;
        value: number;
      };
    }[];
  };
};

type Measurement = {
  assay: OntologyTerm;
  value?: MeasurementValue;
};

type Treatment = {
  agent: OntologyTerm;
};

type MedicalAction = {
  treatment?: Treatment;
  adverse_events?: OntologyTerm[];
  treatment_target?: OntologyTerm;
};

type MetaDataResource = {
  id: string;
  name: string;
  namespace_prefix: string;
  url: string;
  version: string;
  iri_prefix: string;
  created: string;
  updated: string;
};

type MetaData = {
  resources: MetaDataResource[];
  created: string;
  updated: string;
  created_by: string;
  phenopacket_schema_version: string;
};

type Phenopacket = {
  id: string;
  phenotypic_features?: PhenotypicFeature[];
  interpretations?: Interpretation[];
  diseases?: Disease[];
  created: string;
  updated: string;
  measurements?: Measurement[];
  medical_actions?: MedicalAction[];
  meta_data: MetaData;
  dataset: string;
  biosamples?: Biosample[];
};

export type IndividualRootObject = {
  id: string;
  biosamples: Biosample[];
  phenopackets: Phenopacket[];
  created: string;
  updated: string;
  age_numeric: string;
  age_unit: string;
  time_at_last_encounter: {
    age: {
      iso8601duration: string;
    };
  };
  sex: string;
  karyotypic_sex: string;
  taxonomy: OntologyTerm;
  extra_properties: {
    mobility: string;
    covid_severity: string;
    smoking_status: string;
    date_of_consent: string;
    lab_test_result_value: number;
  };
  date_of_birth: string;
};
