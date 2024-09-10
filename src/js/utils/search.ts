import type { QueryParams } from '@/types/search';

export const buildQueryParamsUrl = (pathName: string, qp: QueryParams): string =>
  `${pathName}?${new URLSearchParams(qp).toString()}`;
