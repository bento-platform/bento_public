import { useMemo } from 'react';
import { downloadData, makeProjectDatasetDataTypeResource } from 'bento-auth-js';
import { APPLY_FOR_ACCESS_URL, PCGL_MODE } from '@/config';
import { downloadMetadata } from '@/features/auth/constants';
import { scopeToResource, useSelectedScope } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useHasResourcePermissionWrapper } from '@/hooks';

/**
 * The resource and permission that define "access" to a scope. In PCGL mode, for a dataset scope, it is
 * download:metadata on the dataset's experiment data type (granted by PCGL on DACO approval; allows getting the file
 * manifest). Otherwise it is download:data on the scope.
 */
export const datasetAccessCheck = ({ project, dataset }: DiscoveryScope) =>
  PCGL_MODE && project && dataset
    ? { resource: makeProjectDatasetDataTypeResource(project, dataset, 'experiment'), permission: downloadMetadata }
    : { resource: scopeToResource({ project, dataset }), permission: downloadData };

/**
 * Access state for a scope, from a single permission check (see datasetAccessCheck). hasAccess and canApplyForAccess
 * are mutually exclusive; both are false until the permission check has been attempted.
 * @param scope - Scope to check; defaults to the currently selected scope.
 * @returns hasAccess: the user has access (in PCGL mode for a dataset: can get the file manifest).
 *          canApplyForAccess: the apply-for-access URL is configured and the user lacks access.
 */
export const useDatasetAccess = (scope?: DiscoveryScope) => {
  const { scope: selectedScope } = useSelectedScope();
  const { project, dataset } = scope ?? selectedScope;

  const { resource, permission } = useMemo(() => datasetAccessCheck({ project, dataset }), [project, dataset]);
  const { hasPermission, hasAttempted } = useHasResourcePermissionWrapper(resource, permission);

  return {
    hasAccess: hasAttempted && hasPermission,
    canApplyForAccess: !!APPLY_FOR_ACCESS_URL && hasAttempted && !hasPermission,
  };
};
