import { useCallback } from 'react';
import { downloadAllMatchesCSV } from '@/utils/export';
import { useAppSelector } from '@/hooks';
import { useSelectedScope } from '@/features/metadata/hooks';
import type { ResultsDataEntity } from '@/types/entities';
import type { FiltersState } from '@/features/search/types';

export const useDownloadAllMatchesCSV = () => {
  const auth = useAppSelector((state) => state.auth);
  const selectedScope = useSelectedScope();

  return useCallback(
    (filters: FiltersState, textQuery: string, entity: ResultsDataEntity, filename: string) => {
      return downloadAllMatchesCSV(auth, selectedScope, filters, textQuery, entity, filename);
    },
    [auth, selectedScope]
  );
};
