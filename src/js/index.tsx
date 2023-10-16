import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import { ChartConfigProvider } from 'bento-charts';
import { SUPPORTED_LNGS } from './constants/configConstants';

import 'leaflet/dist/leaflet.css';
import 'bento-charts/src/styles.css';
import './i18n';
import '../styles.css';

import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

import { store } from './store';

const LNGS_ARRAY = Object.values(SUPPORTED_LNGS);
const { Content } = Layout;

const App = () => {
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
    <Layout style={{ minHeight: '100vh' }}>
      <SiteHeader />
      <Content style={{ padding: '0 30px', marginTop: '10px' }}>
        <Routes>
          <Route path="/:page?/*" element={<TabbedDashboard />} />
        </Routes>
      </Content>
      <SiteFooter />
    </Layout>
  );
};

const BentoApp = () => {
  const { i18n } = useTranslation();
  console.log('i18n.language', i18n.language);

  return (
    <ChartConfigProvider Lng={i18n.language ?? SUPPORTED_LNGS.ENGLISH}>
      <Routes>
        <Route path="/:lang?/*" element={<App />} />
      </Routes>
    </ChartConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <HashRouter>
      <BentoApp />
    </HashRouter>
  </Provider>
);
