/**
 * Aggregates an individual's experimental data.
 */

import type { Individual } from './individual';
import type { Biosample } from './biosample';
import type { Interpretation } from './interpretation';
import type { Disease } from './disease';
import type { PhenotypicFeature } from './phenotypic_feature';
import type { Measurement } from './measurement';
import type { MetaData } from './meta_data';
import type { MedicalActionWrapper } from './medical_action';
import type { File } from './file';
import type { TimestampedEntity } from '@/types/util';

export interface Phenopacket extends TimestampedEntity {
  id: string;
  subject: Individual;
  phenotypic_features?: PhenotypicFeature[];
  measurements?: Measurement[];
  biosamples?: Biosample[];
  interpretations?: Interpretation[];
  diseases?: Disease[];
  medical_actions?: MedicalActionWrapper[];
  files?: File[];
  meta_data: MetaData;
  extra_properties?: Record<string, string, number, bool>;
}
