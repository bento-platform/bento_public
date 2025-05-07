import type { JSONType } from './json';

export type ValueOf<T> = T[keyof T];

export interface ExtraPropertiesEntity {
  extra_properties: JSONType;
}

export interface TimestampedEntity {
  created?: string;
  updated?: string;
}
