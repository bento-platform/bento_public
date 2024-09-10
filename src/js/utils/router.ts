import { BentoRoute } from '@/types/routes';
import type { MetadataState } from '@/features/metadata/metadata.store';

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

export const scopeToUrl = (scope: MetadataState['selectedScope']): string => {
  if (scope.project && scope.dataset) {
    return `/p/${scope.project}/d/${scope.dataset}`;
  } else if (scope.project) {
    return `/p/${scope.project}`;
  } else {
    return '';
  }
};
