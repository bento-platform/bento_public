export interface DiscoveryRules {
  max_query_parameters: number;
  count_threshold: number;
  // Older Katsu versions do not send count_rounding.
  count_rounding?: number;
}
