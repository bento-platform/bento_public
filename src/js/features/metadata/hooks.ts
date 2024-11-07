import { useEffect, useMemo } from 'react';
import { useIsAuthenticated } from 'bento-auth-js';

import { useAppDispatch, useAppSelector } from '@/hooks';
import type { Project } from '@/types/metadata';

import { getProjects } from './metadata.store';

export const useMetadata = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch, isAuthenticated]);

  return useAppSelector((state) => state.metadata);
};

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
