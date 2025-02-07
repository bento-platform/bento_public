/**
 * Represents structured definitions of resources and ontologies used in a phenopacket.
 */

import { Resource } from './resource';
import { ExternalReference } from './shared';
import { TimestampedEntity } from '@/types/util';

export interface Update {
  timestamp: string; // DateTime
  updated_by: string;
  comment: string;
}

export interface MetaData extends TimestampedEntity {
  created?: string; // DateTime
  created_by?: string;
  submitted_by?: string;
  resources?: Resource[];
  updates?: Update[];
  phenopacket_schema_version?: string; // Should be "2.0"
  external_references?: ExternalReference[];
  extra_properties?: Record<string, any>; // JSONField
}
