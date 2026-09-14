import type { Dataset } from '@/types/dataset';
import type { FacetId } from './constants';

export type FacetOption = {
  value: string; // Internal value
  label: string; // Translated/human-readable label
  count: number; // Number of matches
  selected: boolean; // Whether the facet is selected
};

/** A single facet option as returned by GET /api/datasets?include=facets, before label/order/selection are applied. */
export interface DatasetFacetOption {
  value: string;
  count: number;
}

/** Censored counts summed across every dataset matching the current search/filter scope (?include=totals). */
export interface DatasetSearchTotals {
  phenopacket: number;
  individual: number;
  biosample: number;
}

export interface DatasetSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dataset[];
  facets?: Record<FacetId, DatasetFacetOption[]>;
  totals?: DatasetSearchTotals;
}
