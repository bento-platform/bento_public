import { useMemo } from 'react';
import { downloadData, makeProjectDatasetDataTypeResource } from 'bento-auth-js';
import { PCGL_MODE } from '@/config';
import { downloadMetadata } from '@/features/auth/constants';
import { scopeToResource, useSelectedScope } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useHasResourcePermissionWrapper } from '@/hooks';

/**
 * The resource and permission that define "access" to a scope. In PCGL mode, for a dataset scope, it is
 * download:metadata on the dataset's experiment data type (granted by PCGL on DACO approval; allows getting the file
 * manifest). Otherwise it is download:data on the scope.
 */
const datasetAccessCheck = ({ project, dataset }: DiscoveryScope) =>
  PCGL_MODE && project && dataset
    ? { resource: makeProjectDatasetDataTypeResource(project, dataset, 'experiment'), permission: downloadMetadata }
    : { resource: scopeToResource({ project, dataset }), permission: downloadData };

/**
 * Access state for a scope, from a single permission check (see datasetAccessCheck).
 * @param scope - Scope to check; defaults to the currently selected scope.
 * @returns hasAccess: the user has access (in PCGL mode for a dataset: can get the file manifest); false until the
 *          permission check has been attempted.
 *          hasAttempted: whether the permission check has been attempted, to distinguish "no access" from "unknown".
 */
export const useDatasetAccess = (scope?: DiscoveryScope) => {
  const { scope: selectedScope } = useSelectedScope();
  const { project, dataset } = scope ?? selectedScope;

  const { resource, permission } = useMemo(() => datasetAccessCheck({ project, dataset }), [project, dataset]);
  const { hasPermission, hasAttempted } = useHasResourcePermissionWrapper(resource, permission);

  return { hasAccess: hasAttempted && hasPermission, hasAttempted };
};
