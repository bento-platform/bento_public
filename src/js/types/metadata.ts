import type { DiscoveryConfig } from '@/types/discovery/config';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { Dataset } from '@/types/dataset';

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets_v2: Dataset[];
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
