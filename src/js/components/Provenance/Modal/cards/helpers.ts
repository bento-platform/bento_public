import type { Publication, PersonOrOrganization, StringOrOntologyClass } from '@/types/dataset';
import type { OntologyTerm } from '@/types/ontology';

export const isOntologyTerm = (k: StringOrOntologyClass): k is OntologyTerm =>
  typeof k === 'object' && k !== null && 'id' in k;

export const ontologyLabel = (k: StringOrOntologyClass): string =>
  isOntologyTerm(k) ? k.label : k;

export const ontologyCurie = (k: StringOrOntologyClass): string | null =>
  isOntologyTerm(k) ? k.id : null;

export const pubTypeLabel = (pt: Publication['publication_type']): string =>
  typeof pt === 'string' ? pt : pt.other;

export const personName = (p: PersonOrOrganization): string => p.name;
