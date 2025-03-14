/**
 * Represents demographic information about an individual (patient).
 */

import type { TimeElement } from './shared';
import type { OntologyTerm } from '../ontology';
import type { Biosample } from '@/types/clinPhen/biosample';
import type { Phenopacket } from '@/types/clinPhen/phenopacket';
import type { TimestampedEntity } from '@/types/util';

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

export interface Individual extends TimestampedEntity {
  id: string;
  alternate_ids?: string[];
  date_of_birth?: string; // Date
  age_numeric?: number;
  age_unit?: string;
  time_at_last_encounter?: TimeElement;
  vital_status?: VitalStatus;
  sex?: Sex;
  karyotypic_sex?: KaryotypicSex;
  taxonomy?: OntologyTerm;
  gender?: OntologyTerm;
  biosamples: Biosample[];
  phenopackets: Phenopacket[];
  extra_properties?: Record<string, string | number | boolean>;
}
