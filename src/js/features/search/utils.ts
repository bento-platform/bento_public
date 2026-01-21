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

export const buildQueryParamsUrl = (pathName: string, qp: QueryParams | undefined = undefined): string =>
  qp && Object.keys(qp).length ? `${pathName}?${new URLSearchParams(qp).toString()}` : pathName;

export const checkQueryParamsEqual = (qp1: QueryParams, qp2: QueryParams): boolean => {
  const qp1Keys = Object.keys(qp1);
  const qp2Keys = Object.keys(qp2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce((acc, v) => acc && qp1[v] === qp2[v], true);
};
