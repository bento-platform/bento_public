import type { HexColor } from 'bento-charts';

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
