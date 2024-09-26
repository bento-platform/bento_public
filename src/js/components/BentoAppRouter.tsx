import { useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk, populateClickable } from '@/features/data/data.store';
import { makeGetKatsuPublic, makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { getBeaconNetworkConfig } from '@/features/beacon/networkConfig.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import { getProjects, selectScope } from '@/features/metadata/metadata.store';

import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import { BentoRoute } from '@/types/routes';
import Loader from '@/components/Loader';
import NetworkUi from './Beacon/BeaconNetwork/NetworkUi';
import { scopeEqual, validProjectDataset } from '@/utils/router';
import DefaultLayout from '@/components/Util/DefaultLayout';

const ScopedRoute = () => {
  const { projectId, datasetId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { selectedScope, projects } = useAppSelector((state) => state.metadata);

  useEffect(() => {
    // Update selectedScope based on URL parameters
    const valid = validProjectDataset(projects, { project: projectId, dataset: datasetId });

    // Don't change the scope object if the scope value is the same, otherwise it'll trigger needless re-renders.
    if (scopeEqual(selectedScope.scope, valid.scope)) return;

    if (datasetId === valid.scope.dataset && projectId === valid.scope.project) {
      dispatch(selectScope(valid.scope));
    } else {
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
    }
  }, [projects, projectId, datasetId, dispatch, navigate, selectedScope]);

  return <Outlet />;
};

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();
  const { selectedScope, isFetching: isFetchingProjects } = useAppSelector((state) => state.metadata);

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => {
      dispatch(getBeaconConfig());
      dispatch(getBeaconNetworkConfig());
    });
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields()).then(() => dispatch(populateClickable()));
    dispatch(makeGetProvenanceRequest());
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
