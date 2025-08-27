import type { JSONObject } from './json';

export type ValueOf<T> = T[keyof T];

export type ExactlyOne<T> = {
  [K in keyof T]: { [P in K]: T[P] } & { [P in Exclude<keyof T, K>]?: never };
}[keyof T];

export interface ExtraPropertiesEntity {
  extra_properties: JSONObject;
}

export interface TimestampedEntity {
  created?: string;
  updated?: string;
}

export type WithVisible<T> = T & {
  isVisible: boolean;
};

export type VisibilityFn<T> = (record: T) => boolean;
