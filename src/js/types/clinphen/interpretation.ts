/**
 * Represents the interpretation of a genomic analysis.
 */

import { Diagnosis } from './diagnosis';
import { TimestampedEntity } from '@/types/util';

export enum ProgressStatus {
  UNKNOWN_PROGRESS = 'UNKNOWN_PROGRESS',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SOLVED = 'SOLVED',
  UNSOLVED = 'UNSOLVED',
}

export interface Interpretation extends TimestampedEntity {
  id: string;
  progress_status?: ProgressStatus;
  diagnosis?: Diagnosis;
  summary?: string;
  extra_properties?: Record<string, any>;
}
