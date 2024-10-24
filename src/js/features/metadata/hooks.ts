import { useMemo } from 'react';
import { useAppSelector } from '@/hooks';
import type { Project } from '@/types/metadata';

export const useMetadata = () => useAppSelector((state) => state.metadata);
export const useSelectedScope = () => useMetadata().selectedScope;

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
