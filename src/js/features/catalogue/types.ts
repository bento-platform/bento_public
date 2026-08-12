export type FacetOption = {
  value: string; // Internal value
  label: string; // Translated/human-readable label
  count: number; // Number of matches
  selected: boolean; // Whether the facet is selected
};
