/**
 * Represents a disease diagnosis.
 */

import { OntologyTerm } from './shared';
import { GenomicInterpretation } from './genomic_interpretation';
import { TimestampedEntity } from '@/types/util';

export interface Diagnosis extends TimestampedEntity {
  id: string;
  disease?: OntologyTerm;
  genomic_interpretations?: GenomicInterpretation[];
  extra_properties?: Record<string, any>;
}
