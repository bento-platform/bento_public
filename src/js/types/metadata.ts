import type { Layout as DiscoveryOverview, Fields as DiscoveryFields } from '@/types/overviewResponse';
import type { Section as DiscoverySearch } from '@/types/search';
import type { DiscoveryRules } from '@/types/configResponse';

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
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: Discovery | null;
  dats_file: object;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
