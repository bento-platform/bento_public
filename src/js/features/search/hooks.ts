import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import { RequestStatus } from '@/types/requests';
import { TEXT_QUERY_PARAM } from './constants';
import type { QueryParams } from './types';

export const useSearchQuery = () => useAppSelector((state) => state.query);

export const useQueryFilterFields = () => {
  const { filterSections } = useSearchQuery();
  return useMemo(
    () => filterSections.flatMap(({ fields }) => fields.map((field) => ({ id: field.id, options: field.options }))),
    [filterSections]
  );
};

export const useNonFilterQueryParams = (): QueryParams => {
  const { mode, textQuery, textQueryStatus } = useSearchQuery();
  return useMemo<QueryParams>(() => {
    const qp: QueryParams = {};
    if (mode === 'text' || textQuery || textQueryStatus === RequestStatus.Fulfilled) {
      // Only include text query parameter if textQuery is set OR we've executed a text query.
      qp[TEXT_QUERY_PARAM] = textQuery;
    }
    return qp;
  }, [mode, textQuery, textQueryStatus]);
};

export const useAllSearchQueryParams = (): QueryParams => {
  const { filterQueryParams } = useSearchQuery();
  const otherQueryParams = useNonFilterQueryParams();
  return useMemo(() => ({ ...filterQueryParams, ...otherQueryParams }), [filterQueryParams, otherQueryParams]);
};
