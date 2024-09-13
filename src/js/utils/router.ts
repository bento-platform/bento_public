import { BentoRoute } from '@/types/routes';
import type { DiscoveryScope, MetadataState } from '@/features/metadata/metadata.store';

export const getCurrentPage = (): string => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.values(BentoRoute);
  if (validPages.includes(pathArray[pathArray.length - 1])) {
    return pathArray[pathArray.length - 1];
  } else {
    return BentoRoute.Overview;
  }
};

export const validProjectDataset = (
  projects: MetadataState['projects'],
  projectId?: string,
  datasetId?: string
): DiscoveryScope => {
  const valid: DiscoveryScope = {
    project: undefined,
    dataset: undefined,
  };

  if (projectId && projects.find(({ identifier }) => identifier === projectId)) {
    valid.project = projectId;
    if (datasetId) {
      if (
        projects
          .find(({ identifier }) => identifier === projectId)!
          .datasets.find(({ identifier }) => identifier === datasetId)
      ) {
        valid.dataset = datasetId;
      }
    }
  }
  return valid;
};

export const scopeToUrl = (scope: DiscoveryScope): string => {
  if (scope.project && scope.dataset) {
    return `/p/${scope.project}/d/${scope.dataset}`;
  } else if (scope.project) {
    return `/p/${scope.project}`;
  } else {
    return '';
  }
};

export const scopeEqual = (s1: DiscoveryScope, s2: DiscoveryScope): boolean =>
  s1.project === s2.project && s1.dataset === s2.dataset;
