import type { Feature, Geometry } from 'geojson';
import type { KatsuEntityCountsOrBooleans } from '@/types/entities';
import type { StringOrOntologyClass } from '@/types/ontology';

export type { StringOrOntologyClass };

/** ISO 639-1 two-letter language code, e.g. "en" or "fr". */
export type LanguageAlpha2 = string;

// ---- String literal unions (from Python TranslatedLiteral definitions) ----

export type Role =
  | 'Principal Investigator'
  | 'Co-Investigator'
  | 'Sub-Investigator'
  | 'Study Director'
  | 'Project Lead'
  | 'Project Manager'
  | 'Researcher'
  | 'Research Assistant'
  | 'Data Scientist'
  | 'Statistician'
  | 'Study Coordinator'
  | 'Lab Technician'
  | 'Participant'
  | 'Subject'
  | 'Volunteer'
  | 'Sponsoring Organization'
  | 'Collaborating Organization'
  | 'Consortium'
  | 'Institution'
  | 'Site'
  | 'Research Center'
  | 'Publisher'
  | 'IRB'
  | 'Ethics Board'
  | 'Data Monitoring Committee'
  | 'Compliance Officer'
  | 'Sponsor'
  | 'Funder'
  | 'Grant Agency'
  | 'Author'
  | 'Corresponding Author'
  | 'Consultant'
  | 'Advisor'
  | 'Reviewer'
  | 'Data Provider'
  | 'Data Controller'
  | 'Data Processor'
  | 'Data Contributor'
  | 'Data Custodian'
  | 'Data Producer'
  | 'Partner'
  | 'Stakeholder'
  | 'Community Representative'
  | 'Other';

export type PublicationType =
  | 'Journal Article'
  | 'Conference Paper'
  | 'Workshop Paper'
  | 'Short Paper'
  | 'Poster'
  | 'Preprint'
  | 'Book'
  | 'Book Chapter'
  | 'Monograph'
  | 'Technical Report'
  | 'White Paper'
  | 'Working Paper'
  | 'Thesis'
  | "Master's Thesis"
  | 'Doctoral Dissertation'
  | 'Dataset'
  | 'Software'
  | 'Software Paper'
  | 'Survey'
  | 'Review Article'
  | 'Editorial'
  | 'Commentary'
  | 'Patent';

export type PublicationVenueType =
  | 'Journal'
  | 'Conference'
  | 'Workshop'
  | 'Repository'
  | 'Publisher'
  | 'University'
  | 'Data Repository';

export type ParticipantCriterionType = 'Inclusion' | 'Exclusion' | 'Other';

export type LinkType =
  | 'Downloadable Artifact'
  | 'Data Management Plan'
  | 'Schema'
  | 'External Reference'
  | 'Data Access'
  | 'Data Request Form';

// ---- Shared primitives ----

/** Fallback value when a TranslatedLiteral union is not exhaustive. */
export interface Other {
  other: string;
}

export interface Phone {
  country_code: number;
  number: number;
  extension?: number | null;
}

/** At least one of website / email / address / phone must be present. */
export interface Contact {
  website?: string | null;
  email?: string[] | null;
  address?: string | null;
  phone?: Phone | null;
}

// ---- People / organizations ----

export interface Organization {
  type: 'organization';
  name: string;
  description?: string | null;
  contact?: Contact | null;
  location?: string | null;
  roles: Role[];
}

export interface Person {
  type: 'person';
  name: string;
  honorific?: string | null;
  /** Alternative names such as maiden names, nicknames, or transliterations. */
  other_names?: string[] | null;
  affiliations?: (Organization | string)[] | null;
  contact?: Contact | null;
  location?: string | null;
  /** ORCID iD in the form XXXX-XXXX-XXXX-XXXX or XXXX-XXXX-XXXX-XXXXX (with trailing X). */
  orcid?: string | null;
  roles: Role[];
}

/** Discriminated union on the `type` field. */
export type PersonOrOrganization = Person | Organization;

// ---- Study descriptors ----

export interface ParticipantCriteria {
  link?: string | null;
  type: ParticipantCriterionType;
  description: string;
}

export interface Count {
  count_entity: string;
  value: number;
  description: string;
}

export interface License {
  label: string;
  type: string;
  url: string;
}

// ---- Publications ----

export interface PublicationVenue {
  name: string;
  venue_type: PublicationVenueType | Other;
  url?: string | null;
  publisher?: string | null;
  location?: string | null;
}

export interface Publication {
  title: string;
  url: string;
  doi?: string | null;
  publication_type: PublicationType | Other;
  authors?: PersonOrOrganization[] | null;
  /** ISO 8601 date string (YYYY-MM-DD). */
  publication_date?: string | null;
  publication_venue?: PublicationVenue | null;
  description?: string | null;
}

// ---- Logos ----

export interface Logo {
  url: string;
  theme: 'light' | 'dark' | 'default';
  description?: string | null;
  /** Whether the logo contains branding text beside the logo image. */
  contains_text: boolean;
}

// ---- Spatial coverage (GeoJSON Feature) ----

export interface SpatialCoverageProperties {
  name: string;
  [key: string]: unknown;
}

export type SpatialCoverageFeature = Feature<Geometry | null, SpatialCoverageProperties>;

// ---- Links ----

export interface Link {
  label: string;
  url: string;
}

export interface TypedLink extends Link {
  type: LinkType | Other;
}

// ---- Funding ----

export interface FundingSource {
  funder?: string | PersonOrOrganization | null;
  grant_numbers?: string[] | null;
}

// ---- Description ----

export interface LongDescription {
  content: string;
  content_type: 'text/html' | 'text/markdown' | 'text/plain';
}

// ---- Ontology types (from bento_lib.ontologies.models) ----

export interface OntologyResource {
  id: string;
  name: string;
  url: string;
  namespace_prefix: string;
  iri_prefix: string;
  repository_url?: string | null;
}

export interface VersionedOntologyResource extends OntologyResource {
  version: string;
}

// ---- Dataset (ProjectScopedDatasetModel) ----

export interface Dataset {
  schema_version: '1.0';
  /** ISO 639-1 two-letter language code. Defaults to "en". */
  language: LanguageAlpha2;

  /** Dataset identifier (max 128 characters). */
  identifier: string;
  /** UUID of the project this dataset belongs to. */
  project: string;

  title: string;
  description: string;
  long_description?: LongDescription | null;

  /** Taxonomic scope of the dataset. */
  taxa?: StringOrOntologyClass[] | null;
  keywords?: StringOrOntologyClass[] | null;
  /** Ontology resources needed to resolve CURIEs in keywords and clinical/phenotypic data. */
  resources?: VersionedOntologyResource[] | null;

  stakeholders?: PersonOrOrganization[] | null;
  /** Funding sources; may also be a free-text string describing the funding. */
  funding_sources?: (FundingSource | Link)[] | string | null;

  /** Either a place name string or a GeoJSON Feature. */
  spatial_coverage?: string | SpatialCoverageFeature | null;
  version?: string | null;
  privacy?: string | null;
  license?: License | null;
  counts?: Count[] | null;
  primary_contact: PersonOrOrganization;
  links?: Link[] | null;
  publications?: Publication[] | null;
  logos?: Logo[] | null;

  /** ISO 8601 date string (YYYY-MM-DD). */
  release_date?: string | null;
  /** ISO 8601 date string (YYYY-MM-DD). */
  last_modified?: string | null;

  participant_criteria?: ParticipantCriteria[] | null;

  study_status?: 'ONGOING' | 'COMPLETED' | null;
  study_context?: 'CLINICAL' | 'RESEARCH' | null;

  /** List of specific scientific or clinical domains addressed by the study. */
  domain?: string[] | null;
  /** The overarching program the study belongs to, if applicable. */
  program_name?: string | null;

  /** Additional custom metadata properties not covered by the standard schema. */
  extra_properties?: Record<string, string | number | boolean | null> | null;

  counts_by_entity?: KatsuEntityCountsOrBooleans;
}
