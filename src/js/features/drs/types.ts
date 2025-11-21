export type DrsChecksum = {
  checksum: string;
  type: string;
};

export type DrsAccessUrl = {
  url: string;
  headers?: string[];
};

type DrsAccessMethodBase = {
  type: 's3' | 'gs' | 'ftp' | 'gsiftp' | 'globus' | 'htsget' | 'https' | 'file';
  cloud?: string;
  region?: string;
  authorizations?: object;
};

// One of either access_url or access_id must be provided.
export type DrsAccessMethod = DrsAccessMethodBase &
  ({ access_url: DrsAccessUrl; access_id?: string } | { access_url?: DrsAccessUrl; access_id: string });

export type DrsRecord = {
  id: string;
  name?: string;
  self_uri: string;
  description?: string;
  aliases?: string[];
  size: number;
  created_time: string;
  updated_time?: string;
  version?: string;
  mime_type?: string;
  checksums: DrsChecksum[];
  access_methods?: DrsAccessMethod[];
};
