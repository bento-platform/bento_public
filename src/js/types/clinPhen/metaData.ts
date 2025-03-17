/**
 * Represents structured definitions of resources and ontologies used in a phenopacket.
 */

import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';
import type { Resource } from './resource';
import type { ExternalReference } from './shared';

export interface Update {
  timestamp: string; // DateTime
  updated_by: string;
  comment: string;
}

export interface MetaData extends ExtraPropertiesEntity, TimestampedEntity {
  created?: string; // DateTime
  created_by?: string;
  submitted_by?: string;
  resources?: Resource[];
  updates?: Update[];
  phenopacket_schema_version?: string; // Should be "2.0"
  external_references?: ExternalReference[];
}
