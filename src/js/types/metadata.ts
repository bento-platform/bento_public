import type { DatsFile } from '@/types/dats';
import type { DiscoveryConfig } from '@/types/discovery/config';

export interface DataCounts {
  experiment: number;
  experiment_result: number;
  biosample: number;
  phenopacket: number;
  individual: number;
}

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  datasets: Dataset[];
  created: string;
  updated: string;
  counts?: DataCounts;
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: DiscoveryConfig | null;
  dats_file: DatsFile;
  counts?: DataCounts;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
