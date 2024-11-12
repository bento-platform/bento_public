import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch } from '@/hooks';

import { invalidateConfig } from '@/features/config/config.store';
import { invalidateData } from '@/features/data/data.store';
import { useMetadata, useSelectedScope } from '@/features/metadata/hooks';
import { type DiscoveryScope, markScopeSet, selectScope } from '@/features/metadata/metadata.store';

import Loader from '@/components/Loader';
import DefaultLayout from '@/components/Util/DefaultLayout';
import { BentoRoute } from '@/types/routes';
import { scopeEqual, validProjectDataset } from '@/utils/router';

import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import NetworkUi from './Beacon/BeaconNetwork/NetworkUi';
import { invalidateQuerySections, invalidateResults } from '@/features/search/query.store';

const ScopedRoute = () => {
  const { projectId, datasetId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedScope, projects, hasAttempted: hasAttemptedProjects } = useMetadata();

  useEffect(() => {
    if (!hasAttemptedProjects) return; // Wait for projects to load first

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

    const oldPath = window.location.pathname.split('/').filter(Boolean);
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
  }, [hasAttemptedProjects, projects, projectId, datasetId, dispatch, navigate, selectedScope]);

  useEffect(() => {
    if (
      projects.length > 1 &&
      selectedScope.scopeSet &&
      !!selectedScope.scope.project &&
      location.pathname.endsWith('beacon')
    ) {
      // TODO: when beacon is scoped, enable for scoped-in too --> remove this effect
      navigate([...location.pathname.split('/').slice(0, -1), 'overview'].join('/'), { replace: true });
    }
  }, [location, navigate, projects, selectedScope]);

  return <Outlet />;
};

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();
  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();
  const { isFetching: isFetchingProjects } = useMetadata();

  const { scopeSet, scope } = useSelectedScope();
  const lastAuthz = useRef<boolean>(!!isAuthenticated);
  const lastScope = useRef<DiscoveryScope | null>(null);

  useEffect(() => {
    // If the scope or isAuthenticated changes, we need to invalidate current state data
    if ((scopeSet && !scopeEqual(scope, lastScope.current)) || isAuthenticated !== lastAuthz.current) {
      dispatch(invalidateConfig());
      dispatch(invalidateData());
      dispatch(invalidateQuerySections());
      dispatch(invalidateResults());
      lastScope.current = scope;
      lastAuthz.current = !!isAuthenticated;
    }
  }, [dispatch, isAuthenticated, scopeSet, scope]);

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
