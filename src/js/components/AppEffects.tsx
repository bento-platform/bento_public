import { useEffect, type ReactNode } from 'react';
import { useIsAuthenticated } from '@/features/auth/hooks';
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
import { getProjects, resetProjects } from '@/features/metadata/metadata.store';
import { getGenomes } from '@/features/reference/reference.store';
import {
  fetchSearchFields,
  fetchDiscoveryUIHints,
  resetAllQueryState,
  preSeedCounts,
} from '@/features/search/query.store';

import Loader from '@/components/Loader';
import { BEACON_UI_ENABLED, BEACON_NETWORK_ENABLED } from '@/config';
import { RequestStatus } from '@/types/requests';

/** App-wide data-fetch effects that need to run for every route, plus a loading gate on the initial project fetch. */
const AppEffects = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const language = useLanguage();

  const isAuthenticated = useIsAuthenticated();
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
  }, [dispatch]);

  useEffect(() => {
    dispatch(resetProjects());
    dispatch(getProjects(language));
  }, [dispatch, language]);

  if (projectsStatus === RequestStatus.Pending) {
    return <Loader fullHeight={true} />;
  }

  return <>{children}</>;
};

export default AppEffects;
