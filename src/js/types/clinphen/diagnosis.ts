/**
 * Represents a disease diagnosis.
 */

import type { OntologyTerm } from './shared';
import type { GenomicInterpretation } from './genomic_interpretation';
import type { TimestampedEntity } from '@/types/util';

export interface Diagnosis extends TimestampedEntity {
  id: string;
  disease?: OntologyTerm;
  genomic_interpretations?: GenomicInterpretation[];
  extra_properties?: Record<string, string, number, bool>;
}
