import type { QueryParams } from '@/features/search/types';

export const queryParamsWithoutKey = (qp: QueryParams, key: string | string[]): QueryParams => {
  const qpc = { ...qp };
  if (typeof key === 'string') {
    delete qpc[key];
  } else {
    key.forEach((k) => {
      delete qpc[k];
    });
  }
  return qpc;
};

export const combineQueryParamsWithoutKey = (qp1: QueryParams, qp2: QueryParams, key: string | string[]): QueryParams =>
  queryParamsWithoutKey({ ...qp1, ...qp2 }, key);

export const buildQueryParamsUrl = (pathName: string, qp: QueryParams): string =>
  `${pathName}?${new URLSearchParams(qp).toString()}`;
