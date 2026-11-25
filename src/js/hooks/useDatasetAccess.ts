import { useCallback, useMemo } from 'react';
import { downloadData, downloadMetadata, makeProjectDatasetDataTypeResource, makeResourceKey } from 'bento-auth-js';
import { PCGL_MODE } from '@/config';
import { scopeToResource, useSelectedScope } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import type { DatasetWithProject } from '@/features/catalogue/constants';
import { useHasResourcePermissionWrapper, useResourcesPermissionsWrapper } from '@/hooks';

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
 * The resource whose download:metadata permission decides whether a dataset is locked: the dataset's experiment data
 * type in PCGL mode, or the dataset itself otherwise. The projects route prefetches these resources' permissions, so
 * the hooks below do not send new requests in the normal case.
 */
const datasetLockResource = (project: string, dataset: string) =>
  PCGL_MODE
    ? makeProjectDatasetDataTypeResource(project, dataset, 'experiment')
    : scopeToResource({ project, dataset });

/**
 * Whether a dataset is locked for the user: the user does not have download:metadata on the dataset's lock resource
 * (see datasetLockResource).
 * @returns false until the permission check has been attempted, so the lock icon does not flash on load.
 */
export const useIsDatasetLocked = (project: string, dataset: string): boolean => {
  const resource = useMemo(() => datasetLockResource(project, dataset), [project, dataset]);
  const { hasAttempted, hasPermission } = useHasResourcePermissionWrapper(resource, downloadMetadata);
  return hasAttempted && !hasPermission;
};

/**
 * Access lookup for many datasets at once, using the same check as useIsDatasetLocked (a dataset is accessible when it
 * is not locked) but in one batched request.
 * @returns A function giving, per dataset, whether the user has access, or undefined until the check has been
 *          attempted (to distinguish "no access" from "unknown"). It changes identity when permissions change.
 */
export const useDatasetsAccess = (items: DatasetWithProject[]) => {
  const resourcesByDataset = useMemo(
    () =>
      new Map(
        items.map(({ project, dataset }) => [
          dataset.identifier,
          datasetLockResource(project.identifier, dataset.identifier),
        ])
      ),
    [items]
  );
  const resources = useMemo(() => [...resourcesByDataset.values()], [resourcesByDataset]);
  const permissionsByResource = useResourcesPermissionsWrapper(resources);

  return useCallback(
    ({ dataset }: DatasetWithProject): boolean | undefined => {
      const resource = resourcesByDataset.get(dataset.identifier);
      if (!resource) return undefined;
      const state = permissionsByResource[makeResourceKey(resource)];
      return state?.hasAttempted ? state.permissions.includes(downloadMetadata) : undefined;
    },
    [resourcesByDataset, permissionsByResource]
  );
};
