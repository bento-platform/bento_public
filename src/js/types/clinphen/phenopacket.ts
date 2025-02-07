/**
 * Aggregates an individual's experimental data.
 */

import { Individual } from './individual';
import { Biosample } from './biosample';
import { Interpretation } from './interpretation';
import { Disease } from './disease';
import { PhenotypicFeature } from './phenotypic_feature';
import { Measurement } from './measurement';
import { MetaData } from './meta_data';
import { MedicalActionWrapper } from './medical_action';
import { File } from './file';
import { TimestampedEntity } from '@/types/util';

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
  extra_properties?: Record<string, any>;
}
