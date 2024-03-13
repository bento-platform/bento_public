export interface ServicesResponse {
  id: string;
  name: string;
  type: Type;
  organization: Organization;
  contactUrl?: string;
  version: string;
  bento: Bento;
  environment?: Environment;
  url: string;
  description?: string;
  welcomeUrl?: string;
}

export interface Bento {
  serviceKind: string;
  gitRepository?: string;
  dataService?: boolean;
  workflowProvider?: boolean;
}

export enum Environment {
  Dev = 'dev',
}

export interface Organization {
  name: string;
  url?: string;
  contactUrl?: string;
  id?: string;
  logoUrl?: string;
  welcomeUrl?: string;
}

export interface Type {
  group: string;
  artifact: string;
  version: string;
}

export interface ServiceInfoStore {
  auth: string;
}
