/**
 * Aggregates an individual's experimental data.
 */

import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { Individual } from './individual';
import type { Biosample } from './biosample';
import type { Interpretation } from './interpretation';
import type { Disease } from './disease';
import type { PhenotypicFeature } from './phenotypicFeature';
import type { Measurement } from './measurement';
import type { MetaData } from './metaData';
import type { MedicalAction } from './medicalAction';
import type { File } from './file';

export interface Phenopacket extends ExtraPropertiesEntity, TimestampedEntity {
  id: string;
  subject?: Individual;
  phenotypic_features?: PhenotypicFeature[];
  measurements?: Measurement[];
  biosamples?: Biosample[];
  interpretations?: Interpretation[];
  diseases?: Disease[];
  medical_actions?: MedicalAction[];
  files?: File[];
  meta_data: MetaData;
  // Non-standard field for back-link to dataset:
  dataset?: string;
}
