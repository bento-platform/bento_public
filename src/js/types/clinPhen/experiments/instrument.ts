import type { OntologyTerm } from '@/types/ontology';
import type { ExtraPropertiesEntity } from '@/types/util';

export interface Instrument extends ExtraPropertiesEntity {
  identifier: string;
  device: string;
  device_ontology: OntologyTerm;
  description: string;
}
