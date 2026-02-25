import type { FiltersState, QueryParamEntries } from '@/features/search/types';
import type { BentoCountEntity, BentoKatsuEntity, ResultsDataEntity } from '@/types/entities';

export const queryParamsWithoutKey = (qp: QueryParamEntries, key: string | string[]): QueryParamEntries => {
  if (typeof key === 'string') {
    return qp.filter(([k, _]) => k !== key);
  } else {
    return qp.filter(([k, _]) => key.includes(k));
  }
};

export const combineQueryParamsWithoutKey = (
  qp1: QueryParamEntries,
  qp2: QueryParamEntries,
  key: string | string[]
): QueryParamEntries => queryParamsWithoutKey([...qp1, ...qp2], key);

export const buildQueryParamsUrl = (pathName: string, queryParamEntries?: QueryParamEntries): string => {
  if (!queryParamEntries || !Object.keys(queryParamEntries).length) return pathName;
  return `${pathName}?${new URLSearchParams(queryParamEntries).toString()}`;
};

export const checkFiltersStatesEqual = (s1: FiltersState, s2: FiltersState): boolean => {
  const qp1Keys = Object.keys(s1);
  const qp2Keys = Object.keys(s2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce((acc, v) => {
    if (Array.isArray(s1[v]) && Array.isArray(s2[v])) {
      return acc && JSON.stringify([...s1[v]].sort()) === JSON.stringify([...s2[v]].sort());
    }
    return acc && s1[v] === s2[v];
  }, true);
};

export const filtersStateToQueryParamEntries = (fs: FiltersState): QueryParamEntries => {
  const entries: QueryParamEntries = [];
  Object.entries(fs).forEach(([k, v]) => {
    if (v === null) return;
    if (Array.isArray(v)) {
      v.forEach((vv) => {
        entries.push([k, vv]);
      });
    } else {
      entries.push([k, v]);
    }
  });
  return entries;
};

export const bentoKatsuEntityToResultsDataEntity = (x: BentoKatsuEntity | BentoCountEntity): ResultsDataEntity =>
  x === 'individual' ? 'phenopacket' : x;
