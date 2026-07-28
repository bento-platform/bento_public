import type { JSONObject } from '@/types/json';

export const objectToBoolean = (obj: object | null | undefined | JSONObject): boolean =>
  obj ? Object.keys(obj).length > 0 : false;
