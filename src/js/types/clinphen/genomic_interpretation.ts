/**
 * Represents a statement about the contribution of a genomic element to a phenotype.
 */

import type { GeneDescriptor } from './gene_descriptor';
import type { VariantInterpretation } from './variant_interpretation';
import type { TimestampedEntity } from '@/types/util';

export enum GenomicInterpretationStatus {
  UNKNOWN_STATUS = 'UNKNOWN_STATUS',
  REJECTED = 'REJECTED',
  CANDIDATE = 'CANDIDATE',
  CONTRIBUTORY = 'CONTRIBUTORY',
  CAUSATIVE = 'CAUSATIVE',
}

export interface GenomicInterpretation extends TimestampedEntity {
  subject_or_biosample_id: string; // Can be Individual.id or Biosample.id
  interpretation_status?: GenomicInterpretationStatus;
  gene_descriptor?: GeneDescriptor;
  variant_interpretation?: VariantInterpretation;
  extra_properties?: Record<string, string | number | boolean>;
}
