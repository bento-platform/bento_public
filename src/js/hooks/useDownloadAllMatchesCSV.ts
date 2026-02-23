import { useCallback } from 'react';
import { downloadAllMatchesCSV } from '@/utils/export';
import { useAppSelector } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import type { ResultsDataEntity } from '@/types/entities';
import type { QueryParams } from '@/features/search/types';

export const useDownloadAllMatchesCSV = () => {
  const auth = useAppSelector((state) => state.auth);
  const selectedScope = useSelectedScope();

  return useCallback(
    (filterQueryParams: QueryParams, textQuery: string, textQueryType: string, entity: ResultsDataEntity, filename: string) => {
      return downloadAllMatchesCSV(auth, selectedScope, filterQueryParams, textQuery, textQueryType, entity, filename);
    },
    [auth, selectedScope]
  );
};
