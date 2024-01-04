import React, { useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// import TabbedDashboard from '@/components/TabbedDashboard';
import { ChartConfigProvider } from 'bento-charts';
import MainPageLayout from '@/components/Layout/MainPageLayout';
import { useAppDispatch, useAppSelector } from '@/hooks';

import { SUPPORTED_LNGS } from '@/constants/configConstants';
import PublicOverview from '@/components/Overview/PublicOverview';
import Search from '@/components/Search/Search';
import BeaconQueryUi from '@/components/Beacon/BeaconQueryUi';
import ProvenanceTab from '@/components/Provenance/ProvenanceTab';
import { makeGetConfigRequest } from '@/features/config/config.store';
import { getBeaconConfig } from '@/features/beacon/beaconConfig.store';
import { makeGetAboutRequest } from '@/features/content/content.store';
import { makeGetDataRequestThunk } from '@/features/data/makeGetDataRequest.thunk';
import { makeGetSearchFields } from '@/features/search/makeGetSearchFields.thunk';
import { makeGetProvenanceRequest } from '@/features/provenance/provenance.store';
import { fetchGohanData, fetchKatsuData } from '@/features/ingestion/lastIngestion.store';

import { CHART_THEME } from '@/constants/overviewConstants';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);

const BentoApp = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(makeGetConfigRequest()).then(() => dispatch(getBeaconConfig()));
    dispatch(makeGetAboutRequest());
    dispatch(makeGetDataRequestThunk());
    dispatch(makeGetSearchFields());
    dispatch(makeGetProvenanceRequest());
    dispatch(fetchKatsuData());
    dispatch(fetchGohanData());
    //TODO: Dispatch makeGetDataTypes to get the data types from service-registry
  }, []);

  useEffect(() => {
    if (lang && LNGS_ARRAY.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (i18n.language) {
      navigate(`/${i18n.language}/`);
    } else {
      navigate(`/${SUPPORTED_LNGS.ENGLISH}/`);
    }
  }, [lang, i18n.language, navigate]);

  const clientName = useAppSelector((state) => state.config.clientName);
  useEffect(() => {
    document.title = clientName && clientName.trim() ? `Bento: ${clientName}` : 'Bento';
  }, [clientName]);

  return (
    <MainPageLayout>
      <Routes>
        {/*<Route path="/:page?/*" element={<TabbedDashboard />} />*/}
        <Route path="/search/*" element={<Search />} />
        <Route path="/beacon/*" element={<BeaconQueryUi />} />
        <Route path="/provenance/*" element={<ProvenanceTab />} />
        <Route path={'/*'} element={<PublicOverview />} />
      </Routes>
    </MainPageLayout>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH} theme={CHART_THEME}>
      <Routes>
        <Route path="/:lang?/*" element={<BentoApp />} />
      </Routes>
    </ChartConfigProvider>
  );
};

export default App;
