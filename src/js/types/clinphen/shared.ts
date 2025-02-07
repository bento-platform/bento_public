/**
 * Shared types and constants used across multiple models.
 */

export interface OntologyTerm {
  id: string;
  label: string;
}

export type TimeElement =
  | { gestational_age: GestationalAge }
  | { age: Age }
  | { age_range: AgeRange }
  | { ontology_class: OntologyTerm }
  | { timestamp: DateTime }
  | { interval: TimeInterval };

export type DateTime = string;

interface GestationalAge {
  days: number;
  weeks: number;
}

interface Age {
  iso8601duration: string;
}

interface AgeRange {
  start: Age;
  end: Age;
}

interface TimeInterval {
  start: DateTime;
  end: DateTime;
}

export interface ExternalReference {
  id: string;
  reference?: string;
  description?: string;
}

export interface Evidence {
  evidence_code: OntologyTerm;
  reference?: ExternalReference;
}

export interface Extension {
  name: string;
  value: string;
}
