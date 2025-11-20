import { useCallback } from 'react';
import { downloadAllMatchesCSV } from '@/utils/export';
import { useAppSelector } from '@/hooks';
import type { ResultsDataEntity } from '@/types/entities';

export const useDownloadAllMatchesCSV = () => {
  const state = useAppSelector((state) => state);

  return useCallback(
    (filterQueryParams: Record<string, string>, textQuery: string, entity: ResultsDataEntity, filename: string) => {
      return downloadAllMatchesCSV(state, filterQueryParams, textQuery, entity, filename);
    },
    [state]
  );
};
