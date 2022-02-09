const { CLIENT, HOST } = process.env;

export const client = CLIENT;
export const dataUrl = HOST + "/data";
export const queryableFieldsUrl = HOST + "/fields";
export const katsuUrl = HOST + "/katsu";