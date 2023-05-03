import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
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

  useEffect(() => {
    // if (lang) {
    //   i18n.changeLanguage(lang);
    // }
    console.log('lang', lang);
  }, [lang, i18n]);

  return (
    <Layout>
      <SiteHeader />
      <Content style={{ padding: '0 30px', marginTop: '10px' }}>
        <TabbedDashboard />
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
        <Route path="/" element={<App />} />
        <Route path="/:lang" element={<App />} />
      </Routes>
    </ChartConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <BentoApp />
    </BrowserRouter>
  </Provider>
);
