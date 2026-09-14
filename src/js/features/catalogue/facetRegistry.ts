import type { FacetId } from '@/features/catalogue/constants';
import { PCGL_MODE } from '@/config';

export interface FacetConfig {
  id: FacetId;
  order?: string[];
  scroll?: boolean;
  i18nKeyPrefix?: string;
}

const PROGRAM_FACET_CONFIG: FacetConfig = { id: 'program' };
const PROJECT_FACET_CONFIG: FacetConfig = { id: 'project' };

// TODO: turn this into a JSON-compatible configuration file that doesn't use PCGL_MODE conditional
export const FACETS: FacetConfig[] = [
  ...[PCGL_MODE ? PROGRAM_FACET_CONFIG : PROJECT_FACET_CONFIG],
  { id: 'domain', scroll: true },
  ...(PCGL_MODE ? [] : ([{ id: 'taxon' }] as FacetConfig[])),
  { id: 'access', order: ['Open', 'Registered', 'Controlled'] },
  { id: 'license' },
  { id: 'context', order: ['CLINICAL', 'RESEARCH'], i18nKeyPrefix: 'provenance.context.' },
  { id: 'status', order: ['ONGOING', 'COMPLETED'], i18nKeyPrefix: 'provenance.status.' },
  { id: 'keyword', scroll: true },
];

export const FACET_CONFIG_BY_ID: Record<FacetId, FacetConfig> = Object.fromEntries(
  FACETS.map((f) => [f.id, f])
) as Record<FacetId, FacetConfig>;
