/**
 * Represents an external resource used for referencing an object.
 */
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';

export interface Resource extends ExtraPropertiesEntity, TimestampedEntity {
  id: string;
  name: string;
  namespace_prefix: string;
  url: string;
  version: string;
  iri_prefix: string;
}
