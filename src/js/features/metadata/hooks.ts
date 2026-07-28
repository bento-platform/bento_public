import { useMemo } from 'react';
import { makeProjectDatasetResource, makeProjectResource, type Resource, RESOURCE_EVERYTHING } from 'bento-auth-js';
import { useAppSelector } from '@/hooks';
import type { Project } from '@/types/metadata';
import type { Dataset } from '@/types/dataset';
import { nonEmptyCounts } from '@/utils/counts';

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

export const useSelectedDataset = (): Dataset | undefined => {
  const selectedProject = useSelectedProject();
  const {
    selectedScope: {
      scope: { dataset: selectedDatasetID },
    },
  } = useMetadata();
  return useMemo(
    () => (selectedProject ? selectedProject.datasets.find((d) => d.identifier === selectedDatasetID) : undefined),
    [selectedProject, selectedDatasetID]
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

export const useScopeHasData = () => {
  const selectedProject = useSelectedProject();
  const selectedDataset = useSelectedDataset();

  return useMemo(
    () =>
      (!!selectedDataset && nonEmptyCounts(selectedDataset.counts_by_entity)) ||
      (!!selectedProject && !selectedDataset && nonEmptyCounts(selectedProject.counts)),
    [selectedProject, selectedDataset]
  );
};
