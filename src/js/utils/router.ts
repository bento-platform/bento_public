import { FORCE_CATALOGUE } from '@/config';
import type { DiscoveryScope, DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';

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
  projectsByID: Record<string, Project>,
  unvalidatedScope: DiscoveryScope
): DiscoveryScopeSelection => {
  const { project, dataset } = unvalidatedScope;

  const valid: DiscoveryScopeSelection = {
    scope: { project: undefined, dataset: undefined },
    scopeSet: true,
    fixedProject: false,
    fixedDataset: false,
  };

  const projects = Object.values(projectsByID);

  if (projects.length === 1 && !FORCE_CATALOGUE) {
    // Automatic project scoping if only 1
    //  - if there is only one project, it should be auto-selected, since it contains the same set of data as the node.
    const defaultProj = projects[0];
    valid.scope.project = defaultProj.identifier;
    valid.fixedProject = true;
    if (defaultProj.datasets.length === 1) {
      // TODO: only if the dataset-level permissions equal the project-level ones...
      // automatic dataset scoping if only 1
      valid.scope.dataset = defaultProj.datasets[0].identifier;
      valid.fixedDataset = true;
      // early return to ignore redundant projectId and datasetId
      return valid;
    }
  }

  const selectedProject: Project | undefined = project ? projectsByID[project] : undefined;

  if (project && selectedProject) {
    valid.scope.project = project;
    if (dataset && selectedProject.datasets.find(({ identifier }) => identifier === dataset)) {
      valid.scope.dataset = dataset;
    }
  }
  return valid;
};

export const scopeToUrl = (scope: DiscoveryScope, prefix: string = '', suffix: string = ''): string => {
  if (scope.project && scope.dataset) {
    return `${prefix}/p/${scope.project}/d/${scope.dataset}/${suffix}`;
  } else if (scope.project) {
    return `${prefix}/p/${scope.project}/${suffix}`;
  } else {
    return `${prefix}/${suffix}`;
  }
};

export const scopeEqual = (s1: DiscoveryScope, s2: DiscoveryScope): boolean =>
  s1.project === s2.project && s1.dataset === s2.dataset;
