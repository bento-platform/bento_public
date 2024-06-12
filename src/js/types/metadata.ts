interface DiscoveryOverview {}
interface DiscoverySearch {}
interface DiscoveryFields {}
interface DiscoveryRules {}

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
  discovery: Discovery;
  datasets: Dataset[];
}

export interface Dataset {
  identifier: string;
  title: string;
  description: string;
  discovery: Discovery;
  dats_file: object;
}

export interface PaginatedResponse<T> {
  count: number;
  next: T;
  previous: T;
  results: T[];
}

export type ProjectsResponse = PaginatedResponse<Project>;
