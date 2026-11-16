import type { DatasetWithProject, FacetId } from '@/features/catalogue/constants';
import { PCGL_MODE } from '@/config';
import type { NamespaceTranslationFunction } from '@/types/translation';
import { getLabel, normaliseStatus, UNASSIGNED_STATUS } from './utils';

export interface FacetConfig {
  id: FacetId;
  getValues: (datasetWithProject: DatasetWithProject) => string[];
  order?: string[];
  scroll?: boolean;
  /** Optional override for how a facet value is displayed. Values are otherwise rendered as-is,
   *  since the backend already returns them pre-translated; used for client-only sentinel values
   *  like {@link UNASSIGNED_STATUS} that still need translating. */
  formatLabel?: (value: string, t: NamespaceTranslationFunction) => string;
}

const PROGRAM_FACET_CONFIG: FacetConfig = {
  id: 'program',
  getValues: ({ dataset }) => (dataset.program_name ? [dataset.program_name] : []),
};

const PROJECT_FACET_CONFIG: FacetConfig = {
  id: 'project',
  getValues: ({ project }) => [project.title],
};

// TODO: turn this into a JSON-compatible configuration file that doesn't use PCGL_MODE conditional
export const FACETS: FacetConfig[] = [
  ...[PCGL_MODE ? PROGRAM_FACET_CONFIG : PROJECT_FACET_CONFIG],
  { id: 'domain', getValues: ({ dataset }) => dataset.domain ?? [], scroll: true },
  ...(PCGL_MODE
    ? []
    : ([{ id: 'taxon', getValues: ({ dataset }) => (dataset.taxa ?? []).map(getLabel) }] as FacetConfig[])),
  {
    id: 'access',
    getValues: ({ dataset }) => (dataset.privacy ? [dataset.privacy] : []),
    order: ['Open', 'Registered', 'Controlled'],
  },
  { id: 'license', getValues: ({ dataset }) => (dataset.license?.type ? [dataset.license.type] : []) },
  {
    id: 'context',
    getValues: ({ dataset }) => (dataset.study_context ? [dataset.study_context] : []),
  },
  {
    id: 'status',
    getValues: ({ dataset }) => [normaliseStatus(dataset.study_status)],
    formatLabel: (value, t) => (value === UNASSIGNED_STATUS ? t('provenance.status.unassigned') : value),
  },
  { id: 'keyword', getValues: ({ dataset }) => (dataset.keywords ?? []).map(getLabel), scroll: true },
];

export const FACET_CONFIG_BY_ID: Record<FacetId, FacetConfig> = Object.fromEntries(
  FACETS.map((f) => [f.id, f])
) as Record<FacetId, FacetConfig>;
