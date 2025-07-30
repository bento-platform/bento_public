import type { JSONType } from '@/types/json';

export const objectToBoolean = (obj: object | undefined | JSONType): boolean =>
  obj ? Object.keys(obj).length > 0 : false;
