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
): MetadataState['selectedScope'] => {
  const valid: MetadataState['selectedScope'] = {
    scope: { project: undefined, dataset: undefined },
    fixedProject: false,
    fixedDataset: false,
  };

  if (projects.length === 1) {
    // automatic project scoping if only 1
    const defaultProj = projects[0];
    valid.scope.project = defaultProj.identifier;
    valid.fixedProject = true;
    if (defaultProj.datasets.length === 1) {
      // automatic dataset scoping if only 1
      valid.scope.dataset = defaultProj.datasets[0].identifier;
      valid.fixedDataset = true;
      // early return to ignore redundant projectId and datasetId
      return valid;
    }
  }
  if (projectId && projects.find(({ identifier }) => identifier === projectId)) {
    valid.scope.project = projectId;
    if (datasetId) {
      if (
        projects
          .find(({ identifier }) => identifier === projectId)!
          .datasets.find(({ identifier }) => identifier === datasetId)
      ) {
        valid.scope.dataset = datasetId;
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
