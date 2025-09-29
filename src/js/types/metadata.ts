import type { DatsFile } from '@/types/dats';
import type { DiscoveryConfig } from '@/types/discovery/config';

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets: Dataset[];
  created: string;
  updated: string;
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  dats_file: DatsFile;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
