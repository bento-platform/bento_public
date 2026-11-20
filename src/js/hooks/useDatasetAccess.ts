import { useMemo } from 'react';
import {
  downloadData,
  downloadMetadata,
  makeProjectDatasetDataTypeResource,
  makeProjectDatasetResource,
  queryData,
} from 'bento-auth-js';
import { PCGL_MODE } from '@/config';
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

/**
 * Whether a dataset is locked for the user: the user has neither download:metadata on the dataset's
 * experiment data type nor query:data on the dataset. The projects route prefetches both resources' permissions, so this hook does not send new requests in the normal case.
 * @returns false until both permission checks have been attempted, so the lock icon does not flash on load.
 */
export const useIsDatasetLocked = (project: string, dataset: string): boolean => {
  const experimentResource = useMemo(
    () => makeProjectDatasetDataTypeResource(project, dataset, 'experiment'),
    [project, dataset]
  );
  const datasetResource = useMemo(() => makeProjectDatasetResource(project, dataset), [project, dataset]);

  const metadata = useHasResourcePermissionWrapper(experimentResource, downloadMetadata);
  const query = useHasResourcePermissionWrapper(datasetResource, queryData);

  return metadata.hasAttempted && query.hasAttempted && !metadata.hasPermission && !query.hasPermission;
};
