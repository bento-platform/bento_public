import { BentoRoute } from '@/types/routes';
import { MetadataState } from '@/features/metadata/metadata.store';

export const getCurrentPage = (): BentoRoute => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.values(BentoRoute);
  if (validPages.includes(pathArray[pathArray.length - 1] as BentoRoute)) {
    return pathArray[pathArray.length - 1] as BentoRoute;
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
