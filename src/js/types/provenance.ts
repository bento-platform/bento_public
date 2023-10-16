export interface ProvenanceAPIResponse {
  datasets: Dataset[];
}

export type ProvenanceStore = ProvenanceStoreDataset[];
export interface ProvenanceStoreDataset extends Dataset, DatsFile {}

export interface Dataset {
  contact_info: string;
  dats_file: DatsFile;
  description: string;
  title: string;
  version: string;
  identifier: string;
}

export interface DatsFile {
  acknowledges: Acknowledge[];
  creators: Creator[];
  description: string;
  distributions: Distribution[];
  extraProperties: ExtraProperty[];
  isAbout: IsAbout[];
  keywords: Annotation[];
  licenses: License[];
  primaryPublications: PrimaryPublication[];
  privacy: string;
  spatialCoverage: SpatialCoverage[];
  title: string;
  types: Type[];
  version: string;
}

export interface Acknowledge {
  funders: Funder[];
  name: string;
}

export interface Funder {
  abbreviation: string;
  name: string;
}

export interface Creator {
  name: string;
  roles: Annotation[];
  abbreviation?: string;
}

export interface Annotation {
  value: string | number;
  valueIRI?: string;
}

export interface Distribution {
  access: Access;
  formats: string[];
  size: number;
  unit: Annotation;
}

export interface Access {
  authorizations: Annotation[];
  landingPage: string;
}

export interface ExtraProperty {
  category: string;
  values: Annotation[];
}

export interface IsAbout {
  identifier: Identifier;
  name: string;
}

export interface Identifier {
  identifier: string;
  identifierSource: string;
}

export interface License {
  name: string;
}

export interface Person {
  fullName: string;
}

export interface DateInfo {
  date: string;
  type?: Annotation;
}

export interface PrimaryPublication {
  authors?: Person[];
  dates?: DateInfo[];
  identifier: Identifier;
  publicationVenue: string;
  title: string;
}

export interface SpatialCoverage {
  description: string;
  name: string;
}

export interface Type {
  information: Annotation;
}
