import { queryData } from 'bento-auth-js';
import { useConfig } from '@/features/config/hooks';
import { useSelectedScopeAsResource } from '@/features/metadata/hooks';
import { useHasResourcePermissionWrapper } from '@/hooks';

export const useCanSeeUncensoredCounts = () => {
  const scopeResource = useSelectedScopeAsResource();
  const { hasPermission: queryDataPerm } = useHasResourcePermissionWrapper(scopeResource, queryData);
  const { countThreshold } = useConfig();

  // Used mostly for UI - showing dashes vs "0".
  //  - If we have query:data permissions or the low cell count threshold is low enough that we get uncensored counts,
  //    then this becomes true.
  return queryDataPerm || countThreshold <= 1;
};
