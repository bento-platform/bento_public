import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch } from '@/hooks';

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetKatsuPublic, makeGetSearchFields } from '@/features/search/query.store';
import { getBeaconConfig } from '@/features/beacon/beacon.store';
import { getBeaconNetworkConfig } from '@/features/beacon/network.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { useMetadata } from '@/features/metadata/hooks';
import { getProjects, markScopeSet, selectScope } from '@/features/metadata/metadata.store';
import { getGenomes } from '@/features/reference/reference.store';

import Loader from '@/components/Loader';
import DefaultLayout from '@/components/Util/DefaultLayout';
import { BEACON_NETWORK_ENABLED } from '@/config';
import { WAITING_STATES } from '@/constants/requests';
import { RequestStatus } from '@/types/requests';
import { BentoRoute } from '@/types/routes';
import { scopeEqual, validProjectDataset } from '@/utils/router';

import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import NetworkUi from './Beacon/BeaconNetwork/NetworkUi';

const ScopedRoute = () => {
  const { projectId, datasetId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedScope, projects, projectsStatus } = useMetadata();

  useEffect(() => {
    if (WAITING_STATES.includes(projectsStatus)) return; // Wait for projects to load first

    // Update selectedScope based on URL parameters
    const valid = validProjectDataset(projects, { project: projectId, dataset: datasetId });

    // Don't change the scope object if the scope value is the same, otherwise it'll trigger needless re-renders.
    if (scopeEqual(selectedScope.scope, valid.scope)) {
      // Make sure scope is marked as set to trigger the first load.
      // This can happen when the true URL scope is the whole instance, which is also the initial scope value.
      if (!selectedScope.scopeSet) dispatch(markScopeSet());
      return;
    }

    // If the URL scope is valid, store the scope in the Redux store.
    if (datasetId === valid.scope.dataset && projectId === valid.scope.project) {
      dispatch(selectScope(valid.scope)); // Also marks scope as set
      return;
    }

    // Otherwise: validated scope does not match URL params, so we need to re-locate to a valid path.

    const oldPath = location.pathname.split('/').filter(Boolean);
    const newPath = [oldPath[0]];

    if (valid.scope.dataset) {
      newPath.push('p', valid.scope.project as string, 'd', valid.scope.dataset);
    } else if (valid.scope.project) {
      newPath.push('p', valid.scope.project);
    }

    const oldPathLength = oldPath.length;
    if (oldPath[oldPathLength - 3] === 'p' || oldPath[oldPathLength - 3] === 'd') {
      newPath.push(oldPath[oldPathLength - 1]);
    }
    const newPathString = '/' + newPath.join('/');
    navigate(newPathString, { replace: true });
  }, [projects, projectsStatus, projectId, datasetId, dispatch, navigate, selectedScope]);

  return <Outlet />;
};

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();
  const { selectedScope, projectsStatus } = useMetadata();

  useEffect(() => {
    if (!selectedScope.scopeSet) return;
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));

    if (BEACON_NETWORK_ENABLED) {
      dispatch(getBeaconNetworkConfig());
    }

    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetKatsuPublic());
    dispatch(fetchKatsuData());
  }, [dispatch, isAuthenticated, selectedScope]);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(makeGetAboutRequest());
    dispatch(fetchGohanData());
    dispatch(makeGetServiceInfoRequest());
    dispatch(makeGetDataTypes());
    dispatch(getGenomes());
  }, [dispatch]);

  if (isAutoAuthenticating || projectsStatus === RequestStatus.Pending) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          <Route path={BentoRoute.Search} element={<Search />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          {/* Beacon network is only available at the top level - scoping does not make sense for it. */}
          {BentoRoute.BeaconNetwork && <Route path={BentoRoute.BeaconNetwork} element={<NetworkUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path="/p/:projectId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          <Route path={BentoRoute.Search} element={<Search />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path="/p/:projectId/d/:datasetId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          <Route path={BentoRoute.Search} element={<Search />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BentoAppRouter;
