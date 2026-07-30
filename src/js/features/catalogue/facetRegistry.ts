import type { DatasetWithProject, FacetId } from '@/features/catalogue/constants';
import { PCGL_MODE } from '@/config';
import { getLabel, normaliseStatus } from './utils';

interface FacetConfig {
  id: FacetId;
  getValues: (datasetWithProject: DatasetWithProject) => string[];
  order?: string[];
  scroll?: boolean;
}

const PROGRAM_FACET_CONFIG: FacetConfig = {
  id: 'programs',
  getValues: ({ dataset }) => (dataset.program_name ? [dataset.program_name] : []),
};

const PROJECT_FACET_CONFIG: FacetConfig = {
  id: 'projects',
  getValues: ({ project }) => [project.title],
};

export const FACETS: FacetConfig[] = [
  ...[PCGL_MODE ? PROGRAM_FACET_CONFIG : PROJECT_FACET_CONFIG],
  { id: 'domains', getValues: ({ dataset }) => dataset.domain ?? [], scroll: true },
  { id: 'taxa', getValues: ({ dataset }) => (dataset.taxa ?? []).map(getLabel) },
  {
    id: 'access',
    getValues: ({ dataset }) => (dataset.privacy ? [dataset.privacy] : []),
    order: ['Open', 'Registered', 'Controlled'],
  },
  { id: 'licenses', getValues: ({ dataset }) => (dataset.license?.type ? [dataset.license.type] : []) },
  {
    id: 'contexts',
    getValues: ({ dataset }) => (dataset.study_context ? [dataset.study_context] : []),
    order: ['Clinical', 'Research'],
  },
  {
    id: 'statuses',
    getValues: ({ dataset }) => [normaliseStatus(dataset.study_status)],
    order: ['Ongoing', 'Completed', 'Unassigned'],
  },
  { id: 'keywords', getValues: ({ dataset }) => (dataset.keywords ?? []).map(getLabel), scroll: true },
];

export const FACET_CONFIG_BY_ID: Record<FacetId, FacetConfig> = Object.fromEntries(
  FACETS.map((f) => [f.id, f])
) as Record<FacetId, FacetConfig>;
