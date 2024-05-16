import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAutoAuthenticate, useIsAuthenticated } from 'bento-auth-js';

import { makeGetConfigRequest, makeGetServiceInfoRequest } from '@/features/config/config.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/data.store';
import { makeGetSearchFields } from '@/features/search/query.store';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';

import PublicOverview from './Overview/PublicOverview';
import Search from './Search/Search';
import ProvenanceTab from './Provenance/ProvenanceTab';
import BeaconQueryUi from './Beacon/BeaconQueryUi';
import { useAppDispatch } from '@/hooks';
import { makeGetDataTypes } from '@/features/dataTypes/dataTypes.store';
import SitePageLoading from './SitePageLoading';

const BentoAppRouter = () => {
  const dispatch = useAppDispatch();

  const { isAutoAuthenticating } = useAutoAuthenticate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());
    dispatch(fetchKatsuData());
    dispatch(fetchGohanData());
    dispatch(makeGetServiceInfoRequest());
    //TODO: Dispatch makeGetDataTypes to get the data types from service-registry
    if (isAuthenticated) {
      dispatch(makeGetDataTypes());
    }
  }, [isAuthenticated]);

  if (isAutoAuthenticating) {
    return <SitePageLoading />;
  }

  return (
    <div style={{ paddingTop: '10px' }}>
      <Routes>
        <Route path="/overview" element={<PublicOverview />} />
        <Route path="/search/*" element={<Search />} />
        <Route path="/beacon/*" element={<BeaconQueryUi />} />
        <Route path="/provenance/*" element={<ProvenanceTab />} />
        <Route path="/*" element={<PublicOverview />} />
      </Routes>
    </div>
  );
};

export default BentoAppRouter;
