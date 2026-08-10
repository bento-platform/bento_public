import { useCallback } from 'react';
import { useSelectedDataset, useSelectedProject } from '@/features/metadata/hooks';
import { useSearchQuery } from '@/features/search/hooks';
import { RequestStatus } from '@/types/requests';
import type { BentoKatsuEntity } from '@/types/entities';

export const useHaveEntityData = () => {
  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  const scopeCounts = selectedDataset?.counts_by_entity ?? selectedProject?.counts;

  const { uiHints } = useSearchQuery();

  return useCallback(
    (entity: BentoKatsuEntity) =>
      (uiHints.status === RequestStatus.Fulfilled && uiHints.data.entities_with_data.includes(entity)) ||
      (!!scopeCounts && !!scopeCounts[entity]),
    [scopeCounts, uiHints]
  );
};
