import type { StringOrOntologyClass } from '@/types/ontology';

/**
 * Returns a natural key for a StringOrOntologyClass; assumes these values are unique within a list.
 * @param x - String or ontology class instance to generate a natural key for.
 */
export const strOrOntoNatKey = (x: StringOrOntologyClass) => (typeof x === 'string' ? x : x.id);
