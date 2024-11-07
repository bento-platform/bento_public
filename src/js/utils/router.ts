import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';
import type { DiscoveryScope, DiscoveryScopeSelection } from '@/features/metadata/metadata.store';

export const getCurrentPage = (): string => {
  const pathArray = window.location.pathname.split('/');
  const validPages = Object.values(BentoRoute);
  if (validPages.includes(pathArray[pathArray.length - 1])) {
    return pathArray[pathArray.length - 1];
  } else {
    return BentoRoute.Overview;
  }
};

export const validProjectDataset = (projects: Project[], unvalidatedScope: DiscoveryScope): DiscoveryScopeSelection => {
  const { project, dataset } = unvalidatedScope;

  const valid: DiscoveryScopeSelection = {
    scope: { project: undefined, dataset: undefined },
    scopeSet: true,
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
  if (project && projects.find(({ identifier }) => identifier === project)) {
    valid.scope.project = project;
    if (dataset) {
      if (
        projects
          .find(({ identifier }) => identifier === project)!
          .datasets.find(({ identifier }) => identifier === dataset)
      ) {
        valid.scope.dataset = dataset;
      }
    }
  }
  return valid;
};

export const scopeToUrl = (scope: DiscoveryScope, prefix: string = '', suffix: string = ''): string => {
  if (scope.project && scope.dataset) {
    return `${prefix}/p/${scope.project}/d/${scope.dataset}${suffix}`;
  } else if (scope.project) {
    return `${prefix}/p/${scope.project}${suffix}`;
  } else {
    return `${prefix}${suffix}`;
  }
};

export const scopeEqual = (s1: DiscoveryScope | null, s2: DiscoveryScope | null): boolean => {
  if (s1 === null && s2 === null) return true;
  else if (s1 === null || s2 === null) return false;
  else return s1.project === s2.project && s1.dataset === s2.dataset;
};
