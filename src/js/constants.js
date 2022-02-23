const { CLIENT, HOST, DEBUG } = process.env;

export const debug = (DEBUG.toLowerCase() === 'true');
export const client = CLIENT;
export const publicOverviewUrl = HOST + "/overview";
export const queryableFieldsUrl = HOST + "/fields";
export const katsuUrl = HOST + "/katsu";
