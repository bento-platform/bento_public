export interface LastIngestionDataTypeResponse {
  count: number | null;
  id: string;
  label: string;
  last_ingested: string | null;
  queryable: boolean;
}

export type DataResponseArray = LastIngestionDataTypeResponse[];
