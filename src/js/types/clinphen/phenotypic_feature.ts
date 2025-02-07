/**
 * Represents a phenotypic feature of an individual or biosample.
 */
import { Evidence, OntologyTerm, TimeElement } from './shared';
import { TimestampedEntity } from '@/types/util';

export interface PhenotypicFeature extends TimestampedEntity {
  description?: string;
  pftype: OntologyTerm; // Renamed from "type" in the Django model
  excluded?: boolean;
  severity?: OntologyTerm;
  modifiers?: OntologyTerm[];
  onset?: TimeElement;
  resolution?: TimeElement;
  evidence?: Evidence[];
  extra_properties?: Record<string, any>; // JSONField
}
