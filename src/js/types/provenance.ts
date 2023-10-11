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
  keywords: Keyword[];
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
  roles: Keyword[];
  abbreviation?: string;
}

export interface Keyword {
  value: string;
}

export interface Distribution {
  access: Access;
  formats: string[];
  size: number;
  unit: Keyword;
}

export interface Access {
  authorizations: Keyword[];
  landingPage: string;
}

export interface ExtraProperty {
  category: string;
  values: Keyword[];
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

export interface PrimaryPublication {
  authors?: string[];
  dates?: string[];
  identifier: Identifier;
  publicationVenue: string;
  title: string;
}

export interface SpatialCoverage {
  description: string;
  name: string;
}

export interface Type {
  information: Keyword;
}
