import type { DiscoveryRules } from '@/types/discovery/rules';
import type { ChartLayoutSection } from './chartConfig';
import type { Field } from './fieldDefinition';
import type { SearchSection } from './search';

export interface DiscoveryConfig {
  overview: ChartLayoutSection[];
  search: SearchSection[];
  fields: { [key in string]: Field };
  rules: DiscoveryRules;
}
