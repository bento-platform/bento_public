export type OntologyTerm = {
  id: string;
  label: string;
};

export type StringOrOntologyClass = string | OntologyTerm;
