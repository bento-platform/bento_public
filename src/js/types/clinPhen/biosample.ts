import type { GeoLocation } from '@/types/geo';
import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { TimeElement } from './shared';
import type { PhenotypicFeature } from './phenotypicFeature';
import type { Measurement } from './measurement';
import type { Procedure } from './procedure';
import type { File } from './file';

export interface Biosample extends ExtraPropertiesEntity, TimestampedEntity {
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
  // Non-Phenopacket-standard fields:
  location_collected?: GeoLocation;
  is_control_sample?: boolean;
}
