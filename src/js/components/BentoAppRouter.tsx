import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk, populateClickable } from '@/features/data/data.store';
import { makeGetKatsuPublic, makeGetSearchFields } from '@/features/search/query.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { getBeaconNetworkConfig } from '@/features/beacon/networkConfig.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { getProjects, markScopeSet, selectScope } from '@/features/metadata/metadata.store';

import Loader from '@/components/Loader';
import DefaultLayout from '@/components/Util/DefaultLayout';
import { BEACON_NETWORK_ENABLED } from '@/config';
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
  const { selectedScope, projects } = useAppSelector((state) => state.metadata);

  useEffect(() => {
    // Update selectedScope based on URL parameters
    const valid = validProjectDataset(projects, { project: projectId, dataset: datasetId });

    // Don't change the scope object if the scope value is the same, otherwise it'll trigger needless re-renders.
    if (scopeEqual(selectedScope.scope, valid.scope)) {
      // Make sure scope is marked as set to trigger the first load.
      // This can happen when the true URL scope is the whole instance, which is also the initial scope value.
      dispatch(markScopeSet());
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
  }, [projects, projectId, datasetId, dispatch, navigate, selectedScope]);

  return <Outlet />;
};

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();
  const { selectedScope, isFetching: isFetchingProjects } = useAppSelector((state) => state.metadata);

  useEffect(() => {
    if (!selectedScope.scopeSet) return;
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));

    if (BEACON_NETWORK_ENABLED) {
      dispatch(getBeaconNetworkConfig());
    }

    dispatch(makeGetAboutRequest());
    // The "Populate clickable" action needs both chart sections and search fields to be available.
    // TODO: this is not a very good pattern. It would be better to have a memoized way of determining click-ability at
    //  render time.
    Promise.all([dispatch(makeGetDataRequestThunk()), dispatch(makeGetSearchFields())]).then(() =>
      dispatch(populateClickable())
    );
    dispatch(makeGetKatsuPublic());
    dispatch(fetchKatsuData());
  }, [dispatch, isAuthenticated, selectedScope]);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(makeGetAboutRequest());
    dispatch(fetchGohanData());
    dispatch(makeGetServiceInfoRequest());
    if (isAuthenticated) {
      dispatch(makeGetDataTypes());
    }
  }, [dispatch, isAuthenticated]);

  if (isAutoAuthenticating || isFetchingProjects) {
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
          {BentoRoute.BeaconNetwork && <Route path={BentoRoute.BeaconNetwork} element={<NetworkUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path="/p/:projectId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          <Route path={BentoRoute.Search} element={<Search />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          {BentoRoute.BeaconNetwork && <Route path={BentoRoute.BeaconNetwork} element={<NetworkUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>

        <Route path="/p/:projectId/d/:datasetId" element={<ScopedRoute />}>
          <Route index element={<PublicOverview />} />
          <Route path={BentoRoute.Overview} element={<PublicOverview />} />
          <Route path={BentoRoute.Search} element={<Search />} />
          {BentoRoute.Beacon && <Route path={BentoRoute.Beacon} element={<BeaconQueryUi />} />}
          {BentoRoute.BeaconNetwork && <Route path={BentoRoute.BeaconNetwork} element={<NetworkUi />} />}
          <Route path={BentoRoute.Provenance} element={<ProvenanceTab />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default BentoAppRouter;
