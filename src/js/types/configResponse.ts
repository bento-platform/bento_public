export interface KatsuPublicOverviewResponse {
  counts: object;
  fields: object;
  layout: [];
}

export interface DiscoveryRule {
  max_query_parameters: number;
  count_threshold: number;
}
