import { Rule } from 'antd/es/form';
import { BaseOptionType, DefaultOptionType, SelectValue } from 'antd/es/select';
import { Datum } from '@/types/overviewResponse';

export interface FormField {
  name: string;
  rules: Rule[];
  placeholder: string;
  initialValue: string;
}

//   to improve
export type AssemblyIdOptionsType = JSX.Element[];

// export type AssemblyIdOptionsType = SelectValue;

// NO
// export type AssemblyIdOptionsType = (DefaultOptionType | BaseOptionType)[]

// also NO
// export type AssemblyIdOptionsType = IteratorYieldResult<DefaultOptionType | BaseOptionType>

export interface BeaconConfigResponse {
  response?: {
    overview?: {
      counts?: {
        // individuals: number;
        variants?: {
          [key: string]: number;
        };
      };
    };
  };
}

export interface BeaconQueryResponse {
  info?: {
    bento: {
      biosamples: {
        count: number;
        sampled_tissue: Datum[];
      };
      experiments: {
        count: number;
        experiment_type: Datum[];
      };
    };
  };
  responseSummary: {
    count: number;
  };
}
