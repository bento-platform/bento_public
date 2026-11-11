import { useMemo } from 'react';
import { makeProjectDatasetDataTypeResource } from 'bento-auth-js';
import { PCGL_MODE } from '@/config';
import { downloadMetadata } from '@/features/auth/constants';
import { scopeToResource, useSelectedScope } from '@/features/metadata/hooks';
import type { DiscoveryScope } from '@/features/metadata/metadata.store';
import { useHasResourcePermissionWrapper } from '@/hooks';

/**
 * Whether the user can get a scope's file manifest (download:metadata). In PCGL mode, a dataset scope is checked on
 * its experiment data type, the resource PCGL authorization can grant download:metadata on (DACO approval). Bento
 * query:data holders also have it, since query:data gives download:metadata.
 * @param scope - Scope to check; defaults to the currently selected scope.
 */
export const useDatasetManifestPermission = (scope?: DiscoveryScope) => {
  const { scope: selectedScope } = useSelectedScope();
  const { project, dataset } = scope ?? selectedScope;

  const resource = useMemo(
    () =>
      PCGL_MODE && project && dataset
        ? makeProjectDatasetDataTypeResource(project, dataset, 'experiment')
        : // Outside PCGL mode, reuse the scope resource (already fetched elsewhere) to avoid an extra request.
          scopeToResource({ project, dataset }),
    [project, dataset]
  );

  const { hasPermission, hasAttempted } = useHasResourcePermissionWrapper(resource, downloadMetadata);
  return { canGetManifest: hasPermission, hasAttempted };
};
