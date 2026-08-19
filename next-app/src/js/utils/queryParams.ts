export type QueryParamEntry = [string, string];
export type QueryParamEntries = QueryParamEntry[];

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
