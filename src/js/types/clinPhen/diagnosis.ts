/**
 * Represents a disease diagnosis.
 */

import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { GenomicInterpretation } from './genomic_interpretation';

export interface Diagnosis extends ExtraPropertiesEntity, TimestampedEntity {
  id: string;
  disease?: OntologyTerm;
  genomic_interpretations?: GenomicInterpretation[];
}
