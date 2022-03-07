const { CLIENT, HOST, DEBUG, PORTAL_URL, MAX_QUERY_PARAMETERS } = process.env;

export const debug = (DEBUG.toLowerCase() === 'true');
export const client = CLIENT;
export const portalUrl = PORTAL_URL;
export const maxQueryParameters = MAX_QUERY_PARAMETERS;


export const configUrl = HOST + "/config";
export const publicOverviewUrl = HOST + "/overview";
export const queryableFieldsUrl = HOST + "/fields";
export const katsuUrl = HOST + "/katsu";
