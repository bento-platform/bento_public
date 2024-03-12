export interface ServicesResponse {
  id: string;
  name: string;
  type: Type;
  organization: Organization;
  contactUrl?: ContactURL;
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

export enum ContactURL {
  MailtoInfoC3GCA = 'mailto:info@c3g.ca',
}

export enum Environment {
  Dev = 'dev',
}

export interface Organization {
  name: Name;
  url?: string;
  contactUrl?: string;
  id?: string;
  logoUrl?: string;
  welcomeUrl?: string;
}

export enum Name {
  C3G = 'C3G',
  CanadianCentreForComputationalGenomics = 'Canadian Centre for Computational Genomics',
}

export interface Type {
  group: Group;
  artifact: string;
  version: string;
}

export enum Group {
  CAC3GBento = 'ca.c3g.bento',
  CAC3GChord = 'ca.c3g.chord',
  OrgGa4Gh = 'org.ga4gh',
}

export interface ServiceInfoStore {
  auth: string;
}
