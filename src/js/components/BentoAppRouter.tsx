import { type ReactNode, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useIsAuthenticated, useIsAuthReady } from '@/features/auth/hooks';
import { useAppDispatch, useLanguage } from '@/hooks';

import {
  clearBiosampleCache,
  clearIndividualCache,
  clearPhenopacketCache,
  clearExperimentCache,
  clearExperimentResultCache,
} from '@/features/clinPhen/clinPhen.store';
import { makeGetServiceInfoRequest, makeGetConfigRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { getBeaconConfig, getBeaconFilters } from '@/features/beacon/beacon.store';
import { getBeaconNetworkConfig } from '@/features/beacon/network.store';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { useMetadata } from '@/features/metadata/hooks';
import { getProjects, markScopeSet, resetProjects, selectScope } from '@/features/metadata/metadata.store';
import { getGenomes } from '@/features/reference/reference.store';
import { getIgvGenomes } from '@/features/igv/igv.store';
import {
  fetchSearchFields,
  fetchDiscoveryUIHints,
  resetAllQueryState,
  preSeedCounts,
} from '@/features/search/query.store';

import Loader from '@/components/Loader';
import DefaultLayout from '@/components/Util/DefaultLayout';
import { BEACON_UI_ENABLED, BEACON_NETWORK_ENABLED } from '@/config';
import { WAITING_STATES } from '@/constants/requests';
import { RequestStatus } from '@/types/requests';
import {
  getPathPageIndex,
  langAndScopeSelectionToUrl,
  pathParts,
  scopeEqual,
  validProjectDataset,
} from '@/utils/router';

const ScopedRoute = ({ children }: { children: ReactNode }) => {
  const { projectId, datasetId } = useParams<{ projectId?: string; datasetId?: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
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

    const oldPath = pathParts(window.location.pathname);
    const oldPathPageIdx = getPathPageIndex(oldPath);
    const newPathSuffix = oldPath.slice(oldPathPageIdx).join('/');
    const newPath = langAndScopeSelectionToUrl(oldPath[0], valid, newPathSuffix);

    router.replace(newPath);
  }, [projectsByID, datasetToProjectMap, projectsStatus, projectId, datasetId, dispatch, router, selectedScope]);

  return <>{children}</>;
};

const BentoAppRouter = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const language = useLanguage();

  const isAuthenticated = useIsAuthenticated();
  const isAuthReady = useIsAuthReady();
  const {
    selectedScope: { scope, scopeSet },
    projectsByID,
    datasetsByID,
    projectsStatus,
  } = useMetadata();

  useEffect(() => {
    if (!scopeSet) return;

    // Situations where this effect runs:
    //  - First load
    //  - Newly authenticated
    //  - Scope was just set
    //  - Scope changed

    // Reset query state, including currently-applied filters/search; the filters may not be the same between scopes.
    // Preserve node-level counts for data catalogue use, since those won't change between refreshes except if authz
    // changes, in which case the page will hard-refresh (currently) anyway.
    //  TODO: in the future, perhaps filters could be kept if the scopes overlap and we know there's discovery config
    //   inheritance, but this would require quite a bit more logic and maybe is unnecessarily complex.
    dispatch(resetAllQueryState({ resetNodeCounts: false }));

    const preSeededCounts =
      (scope.dataset ? datasetsByID[scope.dataset]?.counts_by_entity : undefined) ??
      (scope.project ? projectsByID[scope.project]?.counts : undefined);
    if (preSeededCounts) {
      dispatch(preSeedCounts(preSeededCounts));
    }

    dispatch(fetchSearchFields());
    dispatch(fetchDiscoveryUIHints());

    if (BEACON_UI_ENABLED) {
      dispatch(getBeaconConfig());
      dispatch(getBeaconFilters());
    }

    // If scope or authorization status changed, invalidate anything which is scope/authz-contextual and uses a
    // lazy-loading-style hook for data fetching:
    console.debug('isAuthenticated | scope | scopeSet changed - dispatching config/dataTypes re-fetch actions', {
      isAuthenticated,
      scope,
      scopeSet,
    });
    // For the new scope/auth state, these invalidations will trigger re-fetches of state which is rendered invalid by
    // the new context.
    //  - Censorship configs are invalid when auth/scope changes, since censorship rules may be different. We need to
    //    refresh them:
    dispatch(makeGetConfigRequest());
    // dispatch(invalidateConfig());
    //  - Data types are (partially) invalid: counts and last-ingestion time may be different; refresh them:
    dispatch(makeGetDataTypes());
  }, [dispatch, isAuthenticated, scope, scopeSet, projectsByID, datasetsByID]);

  useEffect(() => {
    // If authorization status changed, invalidate anything which is authorization-dependent.
    //  - clear the clin/phen caches, since we shouldn't have any detailed data hanging around
    //    post-authorization-status change, especially in case of a sign-out.
    dispatch(clearIndividualCache());
    dispatch(clearPhenopacketCache());
    dispatch(clearBiosampleCache());
    dispatch(clearExperimentCache());
    dispatch(clearExperimentResultCache());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (BEACON_NETWORK_ENABLED) {
      dispatch(getBeaconNetworkConfig());
    }

    dispatch(makeGetAboutRequest());
    dispatch(makeGetServiceInfoRequest());
    dispatch(getGenomes());
    dispatch(getIgvGenomes());
  }, [dispatch]);

  useEffect(() => {
    // Projects are fetched with the user's token, so wait for the session to resolve first.
    if (!isAuthReady) return;
    dispatch(resetProjects());
    dispatch(getProjects(language));
  }, [dispatch, language, isAuthReady]);

  if (!isAuthReady || projectsStatus === RequestStatus.Pending) {
    return <Loader fullHeight={true} />;
  }

  return (
    <DefaultLayout>
      <ScopedRoute>{children}</ScopedRoute>
    </DefaultLayout>
  );
};

export default BentoAppRouter;
