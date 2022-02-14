const { CLIENT, HOST, DEBUG } = process.env;

export const debug = (DEBUG.toLowerCase() === 'true');
export const client = CLIENT;
export const dataUrl = HOST + "/data";
export const queryableFieldsUrl = HOST + "/fields";
export const katsuUrl = HOST + "/katsu";