/**
 * Represents a phenotypic feature of an individual or biosample.
 */
import type { Evidence, TimeElement } from './shared';
import type { OntologyTerm } from '../ontology';
import type { TimestampedEntity } from '@/types/util';

export interface PhenotypicFeature extends TimestampedEntity {
  description?: string;
  pftype: OntologyTerm; // Renamed from "type" in the Django model
  excluded?: boolean;
  severity?: OntologyTerm;
  modifiers?: OntologyTerm[];
  onset?: TimeElement;
  resolution?: TimeElement;
  evidence?: Evidence[];
  extra_properties?: Record<string, string | number | boolean>;
}
