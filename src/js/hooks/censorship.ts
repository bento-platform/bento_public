import { queryData } from 'bento-auth-js';
import { useConfig } from '@/features/config/hooks';
import { useHasScopePermission } from '@/hooks';

export const useCanSeeUncensoredCounts = () => {
  const { hasPermission: queryDataPerm } = useHasScopePermission(queryData);
  const { countThreshold } = useConfig();

  // Used mostly for UI - showing dashes vs "0".
  //  - If we have query:data permissions or the low cell count threshold is low enough that we get uncensored counts,
  //    then this becomes true.
  return queryDataPerm || countThreshold <= 0;
};
