import { useCallback, useMemo } from 'react';
import { downloadData, makeProjectDatasetDataTypeResource, makeResourceKey } from 'bento-auth-js';
import { PCGL_MODE } from '@/config';
import { downloadMetadata } from '@/features/auth/constants';
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
 * Access lookup for many datasets at once, using the same check as useDatasetAccess but with one batched request.
 * @returns A stable function giving, per dataset, whether the user has access, or undefined until the check has been
 *          attempted (to distinguish "no access" from "unknown"). It changes identity when permissions change.
 */
export const useDatasetsAccess = (items: DatasetWithProject[]) => {
  const checks = useMemo(
    () =>
      new Map(
        items.map(({ project, dataset }) => [
          dataset.identifier,
          datasetAccessCheck({ project: project.identifier, dataset: dataset.identifier }),
        ])
      ),
    [items]
  );
  const resources = useMemo(() => [...checks.values()].map(({ resource }) => resource), [checks]);
  const permissionsByResource = useResourcesPermissionsWrapper(resources);

  return useCallback(
    ({ dataset }: DatasetWithProject): boolean | undefined => {
      const check = checks.get(dataset.identifier);
      if (!check) return undefined;
      const state = permissionsByResource[makeResourceKey(check.resource)];
      return state?.hasAttempted ? state.permissions.includes(check.permission) : undefined;
    },
    [checks, permissionsByResource]
  );
};
