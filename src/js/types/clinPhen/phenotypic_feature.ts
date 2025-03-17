/**
 * Represents a phenotypic feature of an individual or biosample.
 */
import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { Evidence, TimeElement } from './shared';

export interface PhenotypicFeature extends ExtraPropertiesEntity, TimestampedEntity {
  description?: string;
  type: OntologyTerm;
  excluded?: boolean;
  severity?: OntologyTerm;
  modifiers?: OntologyTerm[];
  onset?: TimeElement;
  resolution?: TimeElement;
  evidence?: Evidence[];
}
