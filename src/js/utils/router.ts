import { useParams, usePathname } from 'next/navigation';
import { FORCE_CATALOGUE } from '@/config';
import type { DiscoveryScope, DiscoveryScopeSelection } from '@/features/metadata/metadata.store';
import type { Project } from '@/types/metadata';
import { BentoRoute } from '@/types/routes';

// The language segment is a real Next.js route param ([lang]), so next/navigation's usePathname() includes
// it - unlike the old BrowserRouter-basename setup, where it was stripped before react-router ever saw it.
// The functions/hooks below all operate on lang-free, scope-relative paths, so this hook strips it back off.
export const usePathnameNoLang = (): string => {
  const pathname = usePathname();
  const { lang } = useParams<{ lang: string }>();
  const prefix = `/${lang}`;
  if (pathname === prefix) return '/';
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
};

export const pathParts = (pathName: string): string[] => pathName.split('/').slice(1);

export const getPathPageIndex = (pathParts: string[]): number => {
  // We can ascertain from the URL structure which item in the path array represents the current "page"
  // (explore/provenance/etc.)
  //  /about --> ['about'] --> page is at index 0
  //  /p/<uuid>/about --> ['p', '<uuid>', 'about'] --> page is at index 2
  //  /d/<uuid>/about --> ['d', '<uuid>', 'about'] --> page is at index 2
  if (pathParts[0] === 'p' || pathParts[0] === 'd') {
    return 2;
  }
  return 0;
};

export const useCurrentPage = (): string => {
  const pathname = usePathnameNoLang();
  const pathArray = pathParts(pathname);
  const validPages = Object.values(BentoRoute);

  const pageIdx = getPathPageIndex(pathArray);
  const pathPage = pathArray[pageIdx];

  if (pathPage && validPages.includes(pathPage)) {
    return pathPage;
  } else if (pathPage === '' || pathPage === undefined) {
    // '/(p|d)/<uuid>/' or '/(p|d)/<uuid>'
    return BentoRoute.Explore;
  } else {
    // quasi-page used to indicate an unknown path
    return BentoRoute.NotFound;
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
  suffix: string = '',
  fixedProjectAndDataset: boolean = false
): string => {
  // If we have >1 dataset, we need the URL to match the validated scope, so we create a new path and go there.
  // Otherwise (with 1 dataset, i.e., fixedProjectAndDataset), keep URL as clean as possible - with no IDs present.

  if (fixedProjectAndDataset || (!scope.project && !scope.dataset)) {
    return `/${suffix}`;
  } else if (scope.dataset) {
    // Dataset URLs no longer include project
    return `/d/${scope.dataset}/${suffix}`;
  } else {
    // scope.project && !scope.dataset
    return `/p/${scope.project}/${suffix}`;
  }
};

export const scopeSelectionToUrl = (scopeSelection: DiscoveryScopeSelection, suffix: string): string =>
  scopeToUrl(scopeSelection.scope, suffix, scopeSelection.fixedProject && scopeSelection.fixedDataset);

export const scopeEqual = (s1: DiscoveryScope, s2: DiscoveryScope): boolean =>
  s1.project === s2.project && s1.dataset === s2.dataset;
