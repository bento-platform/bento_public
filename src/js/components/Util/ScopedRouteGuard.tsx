'use client';

import { useEffect, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks';
import { useMetadata } from '@/features/metadata/hooks';
import { markScopeSet, selectScope } from '@/features/metadata/metadata.store';
import { WAITING_STATES } from '@/constants/requests';
import {
  getPathPageIndex,
  pathParts,
  scopeEqual,
  scopeSelectionToUrl,
  usePathnameNoLang,
  validProjectDataset,
} from '@/utils/router';
import { useAppRouter } from '@/hooks/useAppRouter';

/**
 * Reconciles the :projectId/:datasetId route params (read via next/navigation's useParams(), which - like
 * react-router's - merges params from every matched segment, so this sees whichever of projectId/datasetId is
 * present for the (root)/p/[projectId]/d/[datasetId] tree it's rendered under, or neither at the root) against
 * the Redux scope, redirecting to a valid scope URL if they disagree.
 */
const ScopedRouteGuard = ({ children }: { children: ReactNode }) => {
  const { projectId, datasetId } = useParams<{ projectId?: string; datasetId?: string }>();
  const dispatch = useAppDispatch();
  const router = useAppRouter();
  const pathname = usePathnameNoLang();
  const { selectedScope, projectsByID, datasetToProjectMap, projectsStatus } = useMetadata();

  useEffect(() => {
    if (WAITING_STATES.includes(projectsStatus)) return; // Wait for projects to load first

    // Derive project from dataset when only datasetId is in URL (new /d/:datasetId routes)
    const effectiveProjectId = projectId ?? (datasetId ? datasetToProjectMap[datasetId] : undefined);

    // Update selectedScope based on URL parameters
    const valid = validProjectDataset(projectsByID, { project: effectiveProjectId, dataset: datasetId });

    // Don't change the scope object if the scope value is the same, otherwise it'll trigger needless re-renders.
    if (scopeEqual(selectedScope.scope, valid.scope)) {
      // Make sure scope is marked as set to trigger the first load.
      // This can happen when the true URL scope is the whole instance, which is also the initial scope value.
      if (!selectedScope.scopeSet) dispatch(markScopeSet());
      return;
    }

    const isFixedProjectAndDataset = valid.fixedProject && valid.fixedDataset;

    // If the URL scope is valid, store the scope in the Redux store.
    // We have two subcases here:
    //  - If the validated scope matches the URL parameters, nothing needs to be done
    //  - No parameters have been supplied, and we have a single-dataset node, in which case we want to keep the "clean"
    //    / blank URL to avoid visual clutter.
    if (
      (datasetId === valid.scope.dataset && effectiveProjectId === valid.scope.project) ||
      (!effectiveProjectId && !datasetId && isFixedProjectAndDataset)
    ) {
      dispatch(selectScope(valid.scope)); // Also marks scope as set
      return;
    }

    // Otherwise: validated scope does not match our desired URL params, so we need to re-locate to a valid path.

    const oldPath = pathParts(pathname);
    const oldPathPageIdx = getPathPageIndex(oldPath);
    const newPathSuffix = oldPath.slice(oldPathPageIdx).join('/');
    const newPath = scopeSelectionToUrl(valid, newPathSuffix);

    router.replace(newPath);
  }, [
    projectsByID,
    datasetToProjectMap,
    projectsStatus,
    projectId,
    datasetId,
    dispatch,
    router,
    selectedScope,
    pathname,
  ]);

  return <>{children}</>;
};

export default ScopedRouteGuard;
