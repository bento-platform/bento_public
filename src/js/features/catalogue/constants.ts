export const FACET_IDS = ['projects', 'dataTypes', 'taxa', 'access', 'licenses', 'statuses', 'keywords'] as const;
export type FacetId = (typeof FACET_IDS)[number];

export const FACET_ORDER: Partial<Record<FacetId, string[]>> = {
  statuses: ['Ongoing', 'Completed', 'Unassigned'],
  access: ['Open', 'Registered', 'Controlled'],
};
