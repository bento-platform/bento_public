import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';
import { useAppDispatch } from '@/hooks';

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk, populateClickable } from '@/features/data/data.store';
import { makeGetKatsuPublic, makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';

import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import { BentoRoute } from '@/types/routes';
import Loader from '@/components/Loader';

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields()).then(() => dispatch(populateClickable()));
    dispatch(makeGetProvenanceRequest());
    dispatch(makeGetKatsuPublic());
    dispatch(fetchKatsuData());
    dispatch(fetchGohanData());
    dispatch(makeGetServiceInfoRequest());

    if (isAuthenticated) {
      dispatch(makeGetDataTypes());
    }
  }, [dispatch, isAuthenticated]);

  if (isAutoAuthenticating) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path={`/${BentoRoute.Overview}`} element={<PublicOverview />} />
      <Route path={`/${BentoRoute.Search}/*`} element={<Search />} />
      <Route path={`/${BentoRoute.Beacon}/*`} element={<BeaconQueryUi />} />
      <Route path={`/${BentoRoute.Provenance}/*`} element={<ProvenanceTab />} />
      <Route path="/*" element={<PublicOverview />} />
    </Routes>
  );
};

export default BentoAppRouter;
