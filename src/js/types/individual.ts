import type { OntologyTerm } from './clinphen/ontology';
import type { Biosample } from './clinphen/resources';
import type { Phenopacket } from '@/types/clinphen/phenopackets';

export type IndividualRootObject = {
  id: string;
  biosamples: Biosample[];
  phenopackets: Phenopacket[];
  created: string;
  updated: string;
  age_numeric: string;
  age_unit: string;
  time_at_last_encounter: {
    age: {
      iso8601duration: string;
    };
  };
  sex: string;
  karyotypic_sex: string;
  taxonomy: OntologyTerm;
  extra_properties: Record<string, string | number | boolean>;
  date_of_birth: string;
};
