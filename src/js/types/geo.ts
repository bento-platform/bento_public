import type { JSONType } from '@/types/json';

type GeoGeometry = {
  type: 'Point';
  coordinates: [number, number] | [number, number, number];
};

// See https://schemablocks.org/schema_pages/Progenetix/GeoLocation/
//  - Based on this schema, but with room for additional properties. Essentially compatible with GeoJSON.
export type GeoLocation = {
  type: 'Feature';
  geometry: GeoGeometry;
  properties: {
    label?: string;
    city?: string;
    country?: string;
    ISO3166alpha3?: string;
    precision?: string;
  } & JSONType;
};
