import type { Datum } from '@/types/discovery';
import type { BentoCountEntity, BentoKatsuEntity } from '@/types/entities';
import type { ChartLayoutSection } from './chartConfig';
import type { Field } from './fieldDefinition';

export interface DiscoveryResponse {
  layout: ChartLayoutSection[];
  fields: DiscoveryFieldResponses;
  root_entity: 'phenopacket';
  queried_entities: BentoKatsuEntity[];
  message?: string | null;
  counts: CountsOrBooleans;
}

export type DiscoveryResponseOrMessage = DiscoveryResponse | { message: string };

// If boolean, it means we have data above the threshold but don't have permissions to view the exact count.
export type CountsOrBooleans = Record<BentoCountEntity, number | boolean> & {
  phenopacket: number | boolean;
  individual: number | boolean;
  biosample: number | boolean;
  experiment: number | boolean;
  experiment_result: number | boolean;
};

export type DiscoveryFieldResponses = {
  [key in string]: DiscoveryFieldResponse;
};

export interface DiscoveryFieldResponse {
  data: Datum[];
  definition: Field;
}
