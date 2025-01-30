import type { Experiment } from '@/types/clinphen/experiments';
import type { OntologyTerm } from '@/types/clinphen/ontology';

export type Instrument = {
  id: number;
  identifier: string;
  created: string;
  updated: string;
};

export type Biosample = {
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

type GenomicInterpretation = {
  id: string;
  created: string;
  updated: string;
  extra_properties?: Record<string, string | number | boolean>;
  gene_descriptor?: {
    created: string;
    symbol: string;
    updated: string;
    value_id: string;
  };
  interpretation_status: string;
  subject_or_biosample_id: string;
};

export type Diagnosis = {
  id: string;
  created?: string;
  updated?: string;
  genomic_interpretations: GenomicInterpretation[];
  disease: {
    id: string;
    label: string;
  } | null;
  extra_properties?: Record<string, string | number | boolean>;
};

export type Interpretation = {
  id: string;
  created: string;
  updated: string;
  progress_status: string;
  summary: string;
  diagnosis: Diagnosis;
};

export type Disease = {
  id: number;
  created: string;
  updated: string;
  term: OntologyTerm;
  excluded: boolean;
};

export type MeasurementValue = {
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

export type Measurement = {
  assay: OntologyTerm;
  value?: MeasurementValue;
};

export type Treatment = {
  agent: OntologyTerm;
};

export type MedicalAction = {
  treatment?: Treatment;
  adverse_events?: OntologyTerm[];
  treatment_target?: OntologyTerm;
};

export type MetaDataResource = {
  id: string;
  name: string;
  namespace_prefix: string;
  url: string;
  version: string;
  iri_prefix: string;
  created: string;
  updated: string;
};

export type MetaData = {
  resources: MetaDataResource[];
  created: string;
  updated: string;
  created_by: string;
  phenopacket_schema_version: string;
};
