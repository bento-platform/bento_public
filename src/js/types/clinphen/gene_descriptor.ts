/**
 * Represents a gene descriptor.
 */
import { TimestampedEntity } from '@/types/util';

export interface GeneDescriptor extends TimestampedEntity {
  value_id: string;
  symbol: string;
  description?: string;
  alternate_ids?: string[];
  xrefs?: string[];
  alternate_symbols?: string[];
  extra_properties?: Record<string, any>;
}
