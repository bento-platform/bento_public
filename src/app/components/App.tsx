import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { SUPPORTED_LNGS } from '@/constants/configConstants';

import TabbedDashboard from '@/components/TabbedDashboard';
import { ChartConfigProvider } from 'bento-charts';
import MainPageLayout from '@/components/Layout/MainPageLayout';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);

const BentoApp = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (lang && LNGS_ARRAY.includes(lang)) {
      i18n.changeLanguage(lang);
    } else if (i18n.language) {
      navigate(`/${i18n.language}/`);
    } else {
      navigate(`/${SUPPORTED_LNGS.ENGLISH}/`);
    }
  }, [lang, i18n.language, navigate]);

  return (
    <MainPageLayout>
      <Routes>
        <Route path="/:page?/*" element={<TabbedDashboard />} />
      </Routes>
    </MainPageLayout>
  );
};

const App = () => {
  const { i18n } = useTranslation();
  console.log('i18n.language', i18n.language);

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH}>
      <Routes>
        <Route path="/:lang?/*" element={<BentoApp />} />
      </Routes>
    </ChartConfigProvider>
  );
};

export default App;
