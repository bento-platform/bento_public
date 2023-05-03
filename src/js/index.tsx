import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { HashRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import { store } from './store';
import { Layout } from 'antd';
const { Content } = Layout;
import '../styles.css';

import './i18n';
import SiteFooter from './components/SiteFooter';
import { ChartConfigProvider } from 'bento-charts';

const App = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    //check if lang is supported else redirect to default
    if (lang === 'en' || lang === 'fr') {
      i18n.changeLanguage(lang);
    } else {
      navigate(`/${i18n.language}`);
    }
    console.log('lang new', lang);
  }, [lang, i18n, navigate]);

  return (
    <Layout>
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
    <ChartConfigProvider Lng={i18n.language ?? 'en'}>
      <Routes>
        <Route path="/:lang?/*" element={<App />} />
        <Route path="*" element={<App />} />
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
