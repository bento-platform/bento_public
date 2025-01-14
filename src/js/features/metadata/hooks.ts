import { useMemo } from 'react';
import { makeProjectDatasetResource, makeProjectResource, type Resource, RESOURCE_EVERYTHING } from 'bento-auth-js';
import { useAppSelector } from '@/hooks';
import type { Project } from '@/types/metadata';

export const useMetadata = () => useAppSelector((state) => state.metadata);

export const useSelectedScope = () => useMetadata().selectedScope;
export const useSelectedScopeAsResource = (): Resource => {
  const { scope } = useSelectedScope();

  if (!scope.project) return RESOURCE_EVERYTHING;
  if (!scope.dataset) return makeProjectResource(scope.project);
  return makeProjectDatasetResource(scope.project, scope.dataset);
};

export const useSelectedProject = (): Project | undefined => {
  const {
    projects,
    selectedScope: {
      scope: { project: selectedProject },
    },
  } = useMetadata();
  return useMemo(
    () => (selectedProject ? projects.find((p) => p.identifier === selectedProject) : undefined),
    [projects, selectedProject]
  );
};

export const useSelectedScopeTitles = () => {
  const selectedProject = useSelectedProject();
  const { scope } = useSelectedScope();

  return useMemo(
    () => ({
      projectTitle: selectedProject?.title,
      datasetTitle: scope.dataset
        ? selectedProject?.datasets.find((dataset) => dataset.identifier === scope.dataset)?.title
        : null,
    }),
    [selectedProject, scope]
  );
};
