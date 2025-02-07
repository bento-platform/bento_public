import type { OntologyTerm, TimeElement } from './shared';
import type { PhenotypicFeature } from './phenotypic_feature';
import type { Measurement } from './measurement';
import type { Procedure } from './procedure';
import type { File } from './file';
import type { TimestampedEntity } from '@/types/util';

export interface Biosample extends TimestampedEntity {
  id: string;
  individual_id?: string;
  derived_from_id?: string;
  description?: string;
  sampled_tissue?: OntologyTerm;
  sample_type?: OntologyTerm;
  phenotypic_features?: PhenotypicFeature[];
  measurements?: Measurement[];
  taxonomy?: OntologyTerm;
  time_of_collection?: TimeElement;
  histological_diagnosis?: OntologyTerm;
  tumor_progression?: OntologyTerm;
  tumor_grade?: OntologyTerm;
  pathological_stage?: OntologyTerm;
  pathological_tnm_finding?: OntologyTerm[];
  diagnostic_markers?: OntologyTerm[];
  procedure?: Procedure;
  files?: File[];
  material_sample?: OntologyTerm;
  sample_processing?: OntologyTerm;
  sample_storage?: OntologyTerm;
  is_control_sample?: boolean;
  extra_properties?: Record<string, string | number | boolean>;
}
