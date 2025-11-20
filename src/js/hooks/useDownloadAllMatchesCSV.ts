import { useCallback } from 'react';
import { downloadAllMatchesCSV } from '@/utils/export';
import { useAppSelector } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import type { ResultsDataEntity } from '@/types/entities';

export const useDownloadAllMatchesCSV = () => {
  const auth = useAppSelector((state) => state.auth);
  const selectedScope = useSelectedScope();

  return useCallback(
    (filterQueryParams: Record<string, string>, textQuery: string, entity: ResultsDataEntity, filename: string) => {
      return downloadAllMatchesCSV(auth, selectedScope, filterQueryParams, textQuery, entity, filename);
    },
    [auth, selectedScope]
  );
};
