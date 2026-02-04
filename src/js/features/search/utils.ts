import type { QueryParams } from '@/features/search/types';
import type { BentoCountEntity, BentoKatsuEntity, ResultsDataEntity } from '@/types/entities';
import { definedQueryParams } from '@/utils/requests';

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

export const buildQueryParamsUrl = (pathName: string, queryParams?: QueryParams): string => {
  if (!queryParams || !Object.keys(queryParams).length) return pathName;
  return `${pathName}?${new URLSearchParams(definedQueryParams(queryParams)).toString()}`;
};

export const checkQueryParamsEqual = (qp1: QueryParams, qp2: QueryParams): boolean => {
  const qp1Keys = Object.keys(qp1);
  const qp2Keys = Object.keys(qp2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce((acc, v) => acc && qp1[v] === qp2[v], true);
};

export const bentoKatsuEntityToResultsDataEntity = (x: BentoKatsuEntity | BentoCountEntity): ResultsDataEntity =>
  x === 'individual' ? 'phenopacket' : x;
