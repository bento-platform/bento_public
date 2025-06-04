import { queryData } from 'bento-auth-js';
import { useConfig } from '@/features/config/hooks';
import { useHasScopePermission } from '@/hooks';

export const useScopeQueryData = () => useHasScopePermission(queryData);

export const useCanSeeUncensoredCounts = () => {
  const { hasPermission: queryDataPerm } = useScopeQueryData();
  const { countThreshold } = useConfig();

  // Used mostly for UI - showing dashes vs "0".
  // True when we have query:data permissions or the low cell count threshold is zero
  return queryDataPerm || countThreshold <= 0;
};
