/**
 * Shared types and constants used across multiple models.
 */

export interface OntologyTerm {
  id: string;
  label: string;
}

export type TimeElementGestationalAge = { gestational_age: GestationalAge };
export type TimeElementAge = { age: Age };
export type TimeElementAgeRange = { age_range: AgeRange };
export type TimeElementOntologyClass = { ontology_class: OntologyTerm };
export type TimeElementTimestamp = { timestamp: DateTime };
export type TimeElementInterval = { interval: TimeInterval };

export type TimeElement =
  | TimeElementGestationalAge
  | TimeElementAge
  | TimeElementAgeRange
  | TimeElementOntologyClass
  | TimeElementTimestamp
  | TimeElementInterval;

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

export interface TimeInterval {
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
