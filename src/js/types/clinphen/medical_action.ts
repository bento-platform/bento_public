import type { ExternalReference, OntologyTerm, TimeElement, TimeInterval } from './shared';
import type { Procedure } from './procedure';
import type { Quantity } from './measurement';

export interface DoseInterval {
  quantity: Quantity;
  schedule_frequency: OntologyTerm;
  interval: TimeInterval;
}

export interface Treatment {
  agent: OntologyTerm;
  route_of_administration?: OntologyTerm;
  dose_intervals?: DoseInterval[];
  drug_type?: string;
  cumulative_dose?: Quantity;
}

export interface RadiationTherapy {
  modality: OntologyTerm;
  body_site: OntologyTerm;
  dosage: number;
  fractions: number;
}

export interface TherapeuticRegimen {
  start_time?: TimeElement;
  end_time?: TimeElement;
  status: string;
  ontology_class?: OntologyTerm;
  external_reference?: ExternalReference;
}

export type MedicalAction = Procedure | Treatment | RadiationTherapy | TherapeuticRegimen;

export interface MedicalActionWrapper {
  treatment_target?: OntologyTerm;
  treatment_intent?: OntologyTerm;
  response_to_treatment?: OntologyTerm;
  adverse_events?: OntologyTerm[];
  treatment_termination_reason?: OntologyTerm;
  procedure?: Procedure;
  treatment?: Treatment;
  radiation_therapy?: RadiationTherapy;
  therapeutic_regimen?: TherapeuticRegimen;
}
