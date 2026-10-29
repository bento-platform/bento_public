import { downloadData } from 'bento-auth-js';
import { APPLY_FOR_ACCESS_URL } from '@/config';
import { useSelectedScope, scopeToResource } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useHasResourcePermissionWrapper } from '@/hooks';

/**
 * Whether the user can apply for access to a scope: the apply-for-access URL is configured and they lack the
 * download:data permission for it.
 * @param scope - Scope to check; defaults to the currently selected scope.
 */
export const useCanApplyForDatasetAccess = (scope?: DiscoveryScope) => {
  const { scope: selectedScope } = useSelectedScope();
  const { hasPermission, fetchingPermission } = useHasResourcePermissionWrapper(
    scopeToResource(scope ?? selectedScope),
    downloadData
  );

  if (!APPLY_FOR_ACCESS_URL) return false;

  return !fetchingPermission && !hasPermission;
};
