import type { JSONSchema7 } from 'json-schema';

export type BentoDataType = {
  id: string;
  label: string;
  queryable: boolean;
  schema: JSONSchema7;
  metadata_schema: JSONSchema7;
  count?: number;
};

export type BentoServiceDataType = BentoDataType & { service_base_url: string };
