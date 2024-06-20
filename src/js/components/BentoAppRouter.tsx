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
    const fetchInitialData = async () => {
      try {
        await dispatch(makeGetConfigRequest());
        await dispatch(getBeaconConfig());
        await dispatch(makeGetAboutRequest());

        await Promise.all([dispatch(makeGetDataRequestThunk()), dispatch(makeGetSearchFields())]);

        dispatch(populateClickable());

        await dispatch(makeGetProvenanceRequest());
        await dispatch(makeGetKatsuPublic());
        await dispatch(fetchKatsuData());
        await dispatch(fetchGohanData());
        await dispatch(makeGetServiceInfoRequest());

        if (isAuthenticated) {
          await dispatch(makeGetDataTypes());
        }
      } catch (error) {
        console.error('Error fetching initial data', error);
      }
    };

    fetchInitialData();
  }, [isAuthenticated]);

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
