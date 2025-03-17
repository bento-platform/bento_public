/**
 * Represents a gene descriptor.
 */
import type { ExtraPropertiesEntity, TimestampedEntity } from '@/types/util';

export interface GeneDescriptor extends ExtraPropertiesEntity, TimestampedEntity {
  value_id: string;
  symbol: string;
  description?: string;
  alternate_ids?: string[];
  xrefs?: string[];
  alternate_symbols?: string[];
}
