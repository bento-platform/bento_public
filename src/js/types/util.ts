export type ValueOf<T> = T[keyof T];

export interface TimestampedEntity {
  created?: string;
  updated?: string;
}
