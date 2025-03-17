type GeoGeometry = {
  type: 'Point';
  coordinates: [number, number] | [number, number, number];
};

export type GeoLocation = {
  type: 'Feature';
  geometry: GeoGeometry;
  properties: {
    label?: string;
    city?: string;
    country?: string;
    ISO3166alpha3?: string;
    precision?: string;
  } & Record<string, string>;
};
