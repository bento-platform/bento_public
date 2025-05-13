import type { ExternalReference, TimeElement, TimeInterval } from './shared';
import type { OntologyTerm } from '../ontology';
import type { Procedure } from './procedure';
import type { Quantity } from './measurement';
import { ExactlyOne } from '../util';

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
  status: string;
  start_time?: TimeElement;
  end_time?: TimeElement;
  ontology_class?: OntologyTerm;
  external_reference?: ExternalReference;
}

type SpecificMedicalAction = ExactlyOne<{
  procedure: Procedure;
  treatment: Treatment;
  radiation_therapy: RadiationTherapy;
  therapeutic_regimen: TherapeuticRegimen;
}>;

// Defined badly in https://phenopacket-schema.readthedocs.io/en/latest/medical-action.html - per Victor, these
// oneOf-type fields in their documentation are wrong and should be structured like this:
export type MedicalAction = {
  treatment_target?: OntologyTerm;
  treatment_intent?: OntologyTerm;
  response_to_treatment?: OntologyTerm;
  adverse_events?: OntologyTerm[];
  treatment_termination_reason?: OntologyTerm;
} & SpecificMedicalAction;
