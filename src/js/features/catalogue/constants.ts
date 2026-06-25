import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';

export const FACET_IDS = ['projects', 'dataTypes', 'taxa', 'access', 'licenses', 'statuses', 'keywords'] as const;
export type FacetId = (typeof FACET_IDS)[number];

export const FACET_ORDER: Partial<Record<FacetId, string[]>> = {
  statuses: ['Ongoing', 'Completed', 'Unassigned'],
  access: ['Open', 'Registered', 'Controlled'],
};

export type SortKey = 'updated_desc' | 'created_desc' | 'title_az' | 'individuals_desc' | 'biosamples_desc';

/** A dataset paired with its parent project. */
export interface DatasetWithProject {
  dataset: Dataset;
  project: Project;
}

type DatasetSortFn = (a: DatasetWithProject, b: DatasetWithProject) => number;

/** Comparator function for each sort key. */
export const SORT_FNS: Record<SortKey, DatasetSortFn> = {
  updated_desc: (a, b) => (b.dataset.last_modified ?? '').localeCompare(a.dataset.last_modified ?? ''),
  created_desc: (a, b) => (b.dataset.release_date ?? '').localeCompare(a.dataset.release_date ?? ''),
  title_az: (a, b) => a.dataset.title.localeCompare(b.dataset.title),
  individuals_desc: (a, b) =>
    (b.dataset.counts_by_entity?.individual ?? 0) - (a.dataset.counts_by_entity?.individual ?? 0),
  biosamples_desc: (a, b) =>
    (b.dataset.counts_by_entity?.biosample ?? 0) - (a.dataset.counts_by_entity?.biosample ?? 0),
};
