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
  extra_properties: {
    mobility: string;
    covid_severity: string;
    smoking_status: string;
    date_of_consent: string;
    lab_test_result_value: number;
  };
  date_of_birth: string;
};
