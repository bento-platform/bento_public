const { CLIENT, HOST, DEBUG, MAX_QUERY_PARAMETERS } = process.env;

export const debug = DEBUG.toLowerCase() === 'true';
export const client = CLIENT;
export const maxQueryParameters = MAX_QUERY_PARAMETERS;

export const configUrl = HOST + '/config';
export const publicOverviewUrl = HOST + '/overview';
export const searchFieldsUrl = HOST + '/fields';
export const katsuUrl = HOST + '/katsu';
export const provenanceUrl = HOST + '/provenance';
