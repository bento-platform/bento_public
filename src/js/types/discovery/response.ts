import type { Datum } from '@/types/discovery';
import type { BentoKatsuEntity, KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { ChartLayoutSection } from './chartConfig';
import type { Field } from './fieldDefinition';

export interface DiscoveryResponse {
  layout: ChartLayoutSection[];
  fields: DiscoveryFieldResponses;
  root_entity: 'phenopacket';
  queried_entities: BentoKatsuEntity[];
  message?: string | null;
  counts: KatsuEntityCountsOrBooleans;
}

export type DiscoveryResponseOrMessage = DiscoveryResponse | { message: string };

export type DiscoveryFieldResponses = {
  [key in string]: DiscoveryFieldResponse;
};

export interface DiscoveryFieldResponse {
  data: Datum[];
  definition: Field;
}
