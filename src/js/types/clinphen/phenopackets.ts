import type { OntologyTerm } from '@/types/clinphen/ontology';
import type {
  Biosample,
  Disease,
  Interpretation,
  Measurement,
  MedicalAction,
  MetaData,
} from '@/types/clinphen/resources';

type PhenotypicFeature = {
  type: OntologyTerm;
  created: string;
  updated: string;
  excluded: boolean;
  phenopacket: string;
};

export type Phenopacket = {
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
