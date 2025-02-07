/**
 * Represents the interpretation of a variant.
 */

import { VariationDescriptor } from './variation_descriptor';
import { TimestampedEntity } from '@/types/util';

export enum AcmgPathogenicityClassification {
  NOT_PROVIDED = 'NOT_PROVIDED',
  BENIGN = 'BENIGN',
  LIKELY_BENIGN = 'LIKELY_BENIGN',
  UNCERTAIN_SIGNIFICANCE = 'UNCERTAIN_SIGNIFICANCE',
  LIKELY_PATHOGENIC = 'LIKELY_PATHOGENIC',
  PATHOGENIC = 'PATHOGENIC',
}

export enum TherapeuticActionability {
  UNKNOWN_ACTIONABILITY = 'UNKNOWN_ACTIONABILITY',
  NOT_ACTIONABLE = 'NOT_ACTIONABLE',
  ACTIONABLE = 'ACTIONABLE',
}

export interface VariantInterpretation extends TimestampedEntity {
  acmg_pathogenicity_classification?: AcmgPathogenicityClassification;
  therapeutic_actionability?: TherapeuticActionability;
  variation_descriptor: VariationDescriptor;
}
