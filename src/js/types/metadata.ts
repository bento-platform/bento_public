import type { DiscoveryConfig } from '@/types/discovery/config';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { Dataset } from '@/types/dataset';

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets: Dataset[];
  created: string;
  updated: string;
  counts?: KatsuEntityCountsOrBooleans;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;

/** Response of Bento Public's own /api/projects route: Katsu's projects plus the user's permissions on them. */
export type ProjectsWithPermissionsResponse = ProjectsResponse & {
  /** The user's permissions, keyed by bento-auth-js makeResourceKey(resource). Empty if permissionsError is set. */
  permissions: Record<string, string[]>;
  permissionsError?: string;
};
