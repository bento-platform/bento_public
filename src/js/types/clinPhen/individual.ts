/**
 * Represents demographic information about an individual (patient).
 */

import type { Biosample } from '@/types/clinPhen/biosample';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { TimeElement } from './shared';

export enum Sex {
  UNKNOWN_SEX = 'UNKNOWN_SEX',
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER_SEX = 'OTHER_SEX',
}

export enum KaryotypicSex {
  UNKNOWN_KARYOTYPE = 'UNKNOWN_KARYOTYPE',
  XX = 'XX',
  XY = 'XY',
  XO = 'XO',
  XXY = 'XXY',
  XXX = 'XXX',
  XXYY = 'XXYY',
  XXXY = 'XXXY',
  XXXX = 'XXXX',
  XYY = 'XYY',
  OTHER_KARYOTYPE = 'OTHER_KARYOTYPE',
}

export interface VitalStatus {
  status: string;
  time_of_death?: TimeElement;
  cause_of_death?: OntologyTerm;
  survival_time_in_days?: number;
}

export interface Individual extends ExtraPropertiesEntity, TimestampedEntity {
  id: string;
  alternate_ids?: string[];
  date_of_birth?: string; // Date
  age_numeric?: number; // Non-standard Bento field
  age_unit?: string; // Non-standard Bento field
  time_at_last_encounter?: TimeElement;
  vital_status?: VitalStatus;
  sex?: Sex;
  karyotypic_sex?: KaryotypicSex;
  taxonomy?: OntologyTerm;
  gender?: OntologyTerm;
  // Non-standard: individuals from Katsu can list their corresponding biosamples. Normally should be accessed through
  // Phenopackets.
  biosamples?: Biosample[];
  // Non-standard: individuals from Katsu can have nested biosamples (inverted relationship from the Phenopackets
  // standard).
  phenopackets?: Phenopacket[];
}
