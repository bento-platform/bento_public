export interface File {
  uri: string;
  undividual_to_file_identifiers?: Record<string, string>;
  file_attributes?: Record<string, string | number | boolean>;
}
