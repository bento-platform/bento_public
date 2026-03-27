import type { BentoCountEntity, BentoKatsuEntity, ResultsDataEntity } from '@/types/entities';
import type { QueryState } from './query.store';
import type { FiltersState, QueryParamEntries } from './types';

export const queryParamsWithoutKey = (qp: QueryParamEntries, key: string | string[]): QueryParamEntries => {
  if (typeof key === 'string') {
    return qp.filter(([k, _]) => k !== key);
  } else {
    return qp.filter(([k, _]) => !key.includes(k));
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

/**
 * Returns whether two filter states are equal for the purpose of state-setting (first boolean) and whether they're
 * equal for the purpose of invalidation (second boolean).
 * @param s1 - The first filter state object
 * @param s2 - The second filter state object
 */
export const checkFiltersStatesEqual = (s1: FiltersState, s2: FiltersState): [boolean, boolean] => {
  const qp1Keys = Object.keys(s1);
  const qp2Keys = Object.keys(s2);
  const params = [...new Set([...qp1Keys, ...qp2Keys])];
  return params.reduce<[boolean, boolean]>(
    (acc, v) => {
      if (Array.isArray(s1[v]) && Array.isArray(s2[v])) {
        const r = JSON.stringify([...s1[v]].sort()) === JSON.stringify([...s2[v]].sort());
        return [acc[0] && r, acc[1] && r];
      }
      return [
        acc[0] && s1[v] === s2[v],
        acc[1] &&
          (s1[v] === s2[v] || (s1[v] === undefined && s2[v] === null) || (s1[v] === null && s2[v] === undefined)),
      ];
    },
    [true, true]
  );
};

export const filtersStateToQueryParamEntries = (fs: FiltersState, filterNulls: boolean = true): QueryParamEntries => {
  const entries: QueryParamEntries = [];
  Object.entries(fs).forEach(([k, v]) => {
    if (filterNulls && v === null) return;
    if (Array.isArray(v)) {
      v.forEach((vv) => {
        entries.push([k, vv]);
      });
    } else {
      entries.push([k, v || '']);
    }
  });
  return entries;
};

export const bentoKatsuEntityToResultsDataEntity = (x: BentoKatsuEntity | BentoCountEntity): ResultsDataEntity =>
  x === 'individual' ? 'phenopacket' : x;

export const searchQueryParamsFromState = (state: QueryState): QueryParamEntries => {
  const { filters, textQuery, textQueryType } = state;
  return [
    ...filtersStateToQueryParamEntries(filters),
    ...(textQuery
      ? ([
          ['_fts', textQuery],
          ['_fts_type', textQueryType],
        ] as QueryParamEntries)
      : []),
  ];
};
