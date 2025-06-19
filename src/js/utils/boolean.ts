import type { JSONType } from '@/types/json';

export const objectToBoolean = (obj: object | undefined | JSONType): boolean => {
  return obj ? Object.keys(obj).length > 0 : false;
};
