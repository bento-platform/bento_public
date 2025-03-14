import type { TimeElement } from './shared';
import type { OntologyTerm } from '../ontology';
import type { Procedure } from './procedure';
import type { TimestampedEntity } from '@/types/util';

export interface ReferenceRange {
  unit: OntologyTerm;
  low: number;
  high: number;
}

export interface Quantity {
  unit: OntologyTerm;
  value: number;
  reference_range?: ReferenceRange;
}

export interface TypedQuantity {
  type: OntologyTerm;
  quantity: Quantity;
}

export interface Value {
  quantity?: Quantity;
  ontology_class?: OntologyTerm;
}

export interface ComplexValue {
  typed_quantities: TypedQuantity[];
}

export interface Measurement extends TimestampedEntity {
  description?: string;
  assay: OntologyTerm;
  time_observed?: TimeElement;
  procedure?: Procedure;
  value?: Value;
  complex_value?: ComplexValue;
}
