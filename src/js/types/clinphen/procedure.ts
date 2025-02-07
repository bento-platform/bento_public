
import { OntologyTerm, TimeElement } from "./shared";

/**
 * Represents a medical procedure performed on a patient or biosample.
 */
export interface Procedure {
    code: OntologyTerm;
    body_site?: OntologyTerm;
    performed?: TimeElement;
}

