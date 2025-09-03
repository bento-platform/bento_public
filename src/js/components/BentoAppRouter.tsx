import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch } from '@/hooks';

import { clearBiosampleCache, clearIndividualCache, clearPhenopacketCache } from '@/features/clinPhen/clinPhen.store';
import { invalidateConfig, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { getBeaconConfig, getBeaconFilters } from '@/features/beacon/beacon.store';
import { getBeaconNetworkConfig } from '@/features/beacon/network.store';
import { invalidateDataTypes } from '@/features/dataTypes/dataTypes.store';
import { useMetadata } from '@/features/metadata/hooks';
import { getProjects, markScopeSet, selectScope } from '@/features/metadata/metadata.store';
import { getGenomes } from '@/features/reference/reference.store';
import { performKatsuDiscovery, fetchSearchFields, resetAllQueryState } from '@/features/search/query.store';

import Loader from '@/components/Loader';
import DefaultLayout from '@/components/Util/DefaultLayout';
import { BEACON_UI_ENABLED, BEACON_NETWORK_ENABLED } from '@/config';
import { WAITING_STATES } from '@/constants/requests';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';
import {
  getPathPageIndex,
  langAndScopeSelectionToUrl,
  pathParts,
  scopeEqual,
  validProjectDataset,
} from '@/utils/router';

import PublicOverview from './Overview/PublicOverview';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import NetworkUi from './Beacon/BeaconNetwork/NetworkUi';
import PhenopacketView from './ClinPhen/PhenopacketView';

const ScopedRoute = () => {
  const { projectId, datasetId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedScope, projectsByID, projectsStatus } = useMetadata();

  useEffect(() => {
    if (WAITING_STATES.includes(projectsStatus)) return; // Wait for projects to load first

    // Update selectedScope based on URL parameters
    const valid = validProjectDataset(projectsByID, { project: projectId, dataset: datasetId });

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
      (datasetId === valid.scope.dataset && projectId === valid.scope.project) ||
      (!projectId && !datasetId && isFixedProjectAndDataset)
    ) {
      dispatch(selectScope(valid.scope)); // Also marks scope as set
      return;
    }

    // Otherwise: validated scope does not match our desired URL params, so we need to re-locate to a valid path.

    const oldPath = pathParts(location.pathname);
    const oldPathPageIdx = getPathPageIndex(oldPath);
    const newPathSuffix = oldPath.slice(oldPathPageIdx).join('/');
    const newPath = langAndScopeSelectionToUrl(oldPath[0], valid, newPathSuffix);

    navigate(newPath, { replace: true });
  }, [projectsByID, projectsStatus, projectId, datasetId, dispatch, navigate, selectedScope]);

  return <Outlet />;
};

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();
  const {
    selectedScope: { scope, scopeSet },
    projectsStatus,
  } = useMetadata();

  useEffect(() => {
    if (!scopeSet) return;

    // Reset query state, including currently-applied filters/search; the filters may not be the same between scopes.
    //  TODO: in the future, perhaps filters could be kept if the scopes overlap and we know there's discovery config
    //   inheritance, but this would require quite a bit more logic and maybe is unnecessarily complex.
    dispatch(resetAllQueryState());

    dispatch(fetchSearchFields());
    dispatch(performKatsuDiscovery());

    if (BEACON_UI_ENABLED) {
      dispatch(getBeaconConfig());
      dispatch(getBeaconFilters());
    }

    // If scope or authorization status changed, invalidate anything which is scope/authz-contextual and uses a
    // lazy-loading-style hook for data fetching:
    console.debug('isAuthenticated | scope | scopeSet changed - dispatching config/dataTypes invalidate actions', {
      isAuthenticated,
      scope,
      scopeSet,
    });
    // For the new scope/auth state, these invalidations will trigger re-fetches of state which is rendered invalid by
    // the new context.
    //  - Censorship configs are invalid when auth/scope changes, since censorship rules may be different.
    dispatch(invalidateConfig());
    //  - Data types are (partially) invalid: counts and last-ingestion time may be different.
    dispatch(invalidateDataTypes());
  }, [dispatch, isAuthenticated, scope, scopeSet]);

  useEffect(() => {
    // If authorization status changed, invalidate anything which is authorization-dependent.
    //  - clear the clin/phen caches, since we shouldn't have any detailed data hanging around
    //    post-authorization-status change, especially in case of a sign-out.
    dispatch(clearIndividualCache());
    dispatch(clearPhenopacketCache());
    dispatch(clearBiosampleCache());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (BEACON_NETWORK_ENABLED) {
      dispatch(getBeaconNetworkConfig());
    }

    dispatch(getProjects());
    dispatch(makeGetAboutRequest());
    dispatch(makeGetServiceInfoRequest());
    dispatch(getGenomes());
  }, [dispatch]);

  if (isAutoAuthenticating || projectsStatus === RequestStatus.Pending) {
    return <Loader fullHeight={true} />;
  }

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          {/* Beacon network is only available at the top level - scoping does not make sense for it. */}
          {BentoRoute.BeaconNetwork && <Route path={BentoRoute.BeaconNetwork} element={<NetworkUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path={`/${BentoRoute.Phenopackets}/:packetId/:tab?`} element={<PhenopacketView />} />

        <Route path="/p/:projectId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path="/p/:projectId/d/:datasetId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BentoAppRouter;
