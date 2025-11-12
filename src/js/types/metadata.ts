import type { DatsFile } from '@/types/dats';
import type { DiscoveryConfig } from '@/types/discovery/config';
import type { KatsuEntityCountsOrBoolean } from '@/types/entities';

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets: Dataset[];
  created: string;
  updated: string;
  counts?: KatsuEntityCountsOrBoolean;
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  dats_file: DatsFile;
  counts?: KatsuEntityCountsOrBoolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
