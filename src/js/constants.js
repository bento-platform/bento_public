const { CLIENT, HOST, DEBUG, MAX_QUERY_PARAMETERS } = process.env;

export const debug = (DEBUG.toLowerCase() === 'true');
export const client = CLIENT;
export const maxQueryParameters = MAX_QUERY_PARAMETERS;


export const configUrl = HOST + "/config";
export const publicOverviewUrl = HOST + "/overview";
export const queryableFieldsUrl = HOST + "/fields";
export const katsuUrl = HOST + "/katsu";

// Bento-web colours
// export const COLORS = [
//     "#3366CC",
//     "#DC3912",
//     "#FF9900",
//     "#109618",
//     "#990099",
//     "#3B3EAC",
//     "#0099C6",
//     "#DD4477",
//     "#66AA00",
//     "#B82E2E",
//     "#316395",
//     "#994499",
//     "#22AA99",
//     "#AAAA11",
//     "#6633CC",
//     "#E67300",
//     "#8B0707",
//     "#329262",
//     "#5574A6",
//     "#3B3EAC",
//   ];
  
// colorbrewer2.org
export const COLORS = [
  "#313695",
  "#a50026",
  "#d73027",
  "#f46d43",
  "#fdae61",
  "#abd9e9",
  "#74add1",
  "#4575b4",


]

export const BAR_CHART_FILL = "#4575b4"
export const BAR_CHART_MISSING_FILL = "#bbbbbb"