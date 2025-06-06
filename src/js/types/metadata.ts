import type { Section as DiscoverySearch } from '@/features/search/types';
import type { Fields as DiscoveryFields, Layout as DiscoveryOverview } from '@/types/overviewResponse';
import type { DiscoveryRules } from '@/types/configResponse';
import type { DatsFile } from '@/types/dats';

export interface Discovery {
  overview: DiscoveryOverview[];
  search: DiscoverySearch[];
  fields: DiscoveryFields;
  rules: DiscoveryRules;
}

export interface Project {
  identifier: string;
  title: string;
  description: string;
  discovery: Discovery | null;
  datasets: Dataset[];
  created: string;
  updated: string;
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: Discovery | null;
  dats_file: DatsFile;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
