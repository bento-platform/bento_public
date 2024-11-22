import { queryData } from 'bento-auth-js';
import { useConfig } from '@/features/config/hooks';
import { useSelectedScopeAsResource } from '@/features/metadata/hooks';
import { useHasResourcePermissionWrapper } from '@/hooks';

export const useCanSeeUncensoredCounts = () => {
  const scopeResource = useSelectedScopeAsResource();
  const { hasPermission: queryDataPerm } = useHasResourcePermissionWrapper(scopeResource, queryData);
  const { countThreshold } = useConfig();

  return queryDataPerm || countThreshold <= 1;
};
