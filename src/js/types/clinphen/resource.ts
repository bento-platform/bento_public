/**
 * Represents an external resource used for referencing an object.
 */
import { TimestampedEntity } from '@/types/util';

export interface Resource extends TimestampedEntity {
  id: string;
  name: string;
  namespace_prefix: string;
  url: string;
  version: string;
  iri_prefix: string;
  extra_properties?: Record<string, any>; // JSONField
}
