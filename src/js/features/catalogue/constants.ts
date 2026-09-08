import type { HexColor } from 'bento-charts';
import type { Dataset } from '@/types/dataset';
import type { Project } from '@/types/metadata';

/** Ordered colour palette used to assign a stable colour per project name. */
export const PALETTE: HexColor[] = ['#1677FF', '#13C2C2', '#722ED1', '#FA8C16', '#52C41A'];

export const FACET_IDS = [
  'program',
  'project',
  'domain',
  'taxon',
  'access',
  'license',
  'context',
  'status',
  'keyword',
] as const;
export type FacetId = (typeof FACET_IDS)[number];

export type SortKey = 'updated_desc' | 'created_desc' | 'title_az' | 'individuals_desc' | 'biosamples_desc';

/** A dataset paired with its parent project. */
export interface DatasetWithProject {
  dataset: Dataset;
  project: Project;
}

type DatasetSortFn = (a: DatasetWithProject, b: DatasetWithProject) => number;

/** Comparator function for each sort key. */
export const SORT_FNS: Record<SortKey, DatasetSortFn> = {
  updated_desc: ({ dataset: a }, { dataset: b }) =>
    (b.last_modified ?? b.updated_at).localeCompare(a.last_modified ?? a.updated_at),
  created_desc: ({ dataset: a }, { dataset: b }) =>
    (b.release_date ?? b.created_at).localeCompare(a.release_date ?? a.created_at),
  title_az: (a, b) => a.dataset.title.localeCompare(b.dataset.title),
  individuals_desc: ({ dataset: a }, { dataset: b }) => {
    const ai = typeof a.counts_by_entity?.individual === 'number' ? a.counts_by_entity.individual : 0;
    const bi = typeof b.counts_by_entity?.individual === 'number' ? b.counts_by_entity.individual : 0;
    return bi - ai;
  },
  biosamples_desc: ({ dataset: a }, { dataset: b }) => {
    const ab = typeof a.counts_by_entity?.biosample === 'number' ? a.counts_by_entity.biosample : 0;
    const bb = typeof b.counts_by_entity?.biosample === 'number' ? b.counts_by_entity.biosample : 0;
    return bb - ab;
  },
};
