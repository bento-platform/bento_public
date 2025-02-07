/**
 * Represents a diagnosis and inference about the cause of observed phenotypic abnormalities.
 */

import { OntologyTerm, TimeElement } from './shared';
import { TimestampedEntity } from '@/types/util';

export interface Disease extends TimestampedEntity {
  term: OntologyTerm;
  excluded?: boolean;
  onset?: TimeElement;
  resolution?: TimeElement;
  disease_stage?: OntologyTerm[];
  clinical_tnm_finding?: OntologyTerm[];
  primary_site?: OntologyTerm;
  laterality?: OntologyTerm;
  extra_properties?: Record<string, any>; // JSONField
}
