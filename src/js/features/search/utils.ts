import type { QueryParams } from '@/features/search/types';

export const queryParamsWithoutKey = (qp: QueryParams, key: string): QueryParams => {
  const qpc = { ...qp };
  delete qpc[key];
  return qpc;
};

export const buildQueryParamsUrl = (pathName: string, qp: QueryParams): string =>
  `${pathName}?${new URLSearchParams(qp).toString()}`;
