import { Rule } from 'antd/es/form'; 
import { BaseOptionType, DefaultOptionType } from 'antd/es/select';

export interface FormField {
    name: string;
    rules: Rule[];
    placeholder: string;
    initialValue: string;
  }


//   to improve
export type AssemblyIdOptionsType = JSX.Element[];

// NO
// export type AssemblyIdOptionsType = (DefaultOptionType | BaseOptionType)[]

// also NO
// export type AssemblyIdOptionsType = IteratorYieldResult<DefaultOptionType | BaseOptionType>