import { downloadData } from 'bento-auth-js';
import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';
import { useSelectedScope, scopeToResource } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useHasResourcePermissionWrapper } from '@/hooks';
import { useDatasetManifestPermission } from '@/hooks/useDatasetManifestPermission';

/**
 * Whether the user can apply for access to a scope: the apply-for-access URL is configured and they lack access.
 * In PCGL mode, for a dataset scope, access means getting the file manifest (download:metadata, granted by PCGL on
 * DACO approval); otherwise it means the download:data permission.
 * @param scope - Scope to check; defaults to the currently selected scope.
 */
export const useCanApplyForDatasetAccess = (scope?: DiscoveryScope) => {
  const { scope: selectedScope } = useSelectedScope();
  const effectiveScope = scope ?? selectedScope;

  const { hasPermission, fetchingPermission } = useHasResourcePermissionWrapper(
    scopeToResource(effectiveScope),
    downloadData
  );
  const { canGetManifest, hasAttempted: attemptedManifest } = useDatasetManifestPermission(effectiveScope);

  if (!APPLY_FOR_ACCESS_URL) return false;

  if (PCGL_MODE && effectiveScope.project && effectiveScope.dataset) return attemptedManifest && !canGetManifest;

  return !fetchingPermission && !hasPermission;
};
