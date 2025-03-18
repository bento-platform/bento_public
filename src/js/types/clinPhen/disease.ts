/**
 * Represents a diagnosis and inference about the cause of observed phenotypic abnormalities.
 */

import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { TimeElement } from './shared';

export interface Disease extends ExtraPropertiesEntity, TimestampedEntity {
  term: OntologyTerm;
  excluded?: boolean;
  onset?: TimeElement;
  resolution?: TimeElement;
  disease_stage?: OntologyTerm[];
  clinical_tnm_finding?: OntologyTerm[];
  primary_site?: OntologyTerm;
  laterality?: OntologyTerm;
}
