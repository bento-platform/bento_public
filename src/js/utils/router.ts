import { type Location as RouterLocation } from 'react-router-dom';
import { FORCE_CATALOGUE } from '@/config';
import type { DiscoveryScope, DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';

export const pathParts = (pathName: string): string[] => pathName.split('/').slice(1);

export const getPathPageIndex = (pathParts: string[]): number => {
  // We can ascertain from the URL structure which item in the path array represents the current "page"
  // (overview/provenance/etc.)
  //  /en/about --> ['en', 'about'] --> page is at index 1
  //  /en/p/<uuid>/about --> ['en', 'p', '<uuid>', 'about'] --> page is at index 3
  //  /en/p/<uuid>/d/<uuid>/about --> ['en', 'p', '<uuid>', 'd', '<uuid>', 'about'] --> page is at index 5
  return pathParts[1] === 'p' ? (pathParts[3] === 'd' ? 5 : 3) : 1;
};

export const getCurrentPage = (location?: RouterLocation | Location): string => {
  const pathArray = pathParts((location ?? window.location).pathname);
  const validPages = Object.values(BentoRoute);

  const pageIdx = getPathPageIndex(pathArray);

  if (validPages.includes(pathArray[pageIdx])) {
    return pathArray[pageIdx];
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

export const scopeToUrl = (
  scope: DiscoveryScope,
  lang: string,
  suffix: string = '',
  fixedProjectAndDataset: boolean = false
): string => {
  // If we have >1 dataset, we need the URL to match the validated scope, so we create a new path and go there.
  // Otherwise (with 1 dataset, i.e., fixedProjectAndDataset), keep URL as clean as possible - with no IDs present.

  if (fixedProjectAndDataset || (!scope.project && !scope.dataset)) {
    return `/${lang}/${suffix}`;
  } else if (scope.project && scope.dataset) {
    return `/${lang}/p/${scope.project}/d/${scope.dataset}/${suffix}`;
  } else {
    // scope.project && !scope.dataset
    return `/${lang}/p/${scope.project}/${suffix}`;
  }
};

export const langAndScopeSelectionToUrl = (
  lang: string,
  scopeSelection: DiscoveryScopeSelection,
  suffix: string
): string => scopeToUrl(scopeSelection.scope, lang, suffix, scopeSelection.fixedProject && scopeSelection.fixedDataset);

export const scopeEqual = (s1: DiscoveryScope, s2: DiscoveryScope): boolean =>
  s1.project === s2.project && s1.dataset === s2.dataset;
