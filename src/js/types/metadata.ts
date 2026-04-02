import type { DiscoveryConfig } from '@/types/discovery/config';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { DatasetV2 } from '@/types/datasetV2';

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets_v2: DatasetV2[];
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
