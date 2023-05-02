import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import { store } from './store';
import { Layout } from 'antd';
const { Content } = Layout;
import '../styles.css';

import './i18n';
import SiteFooter from './components/SiteFooter';
import { ChartConfigProvider } from 'bento-charts';

const BentoApp = () => {
  const { i18n } = useTranslation();
  console.log('i18n.language', i18n.language);
  return (
    <ChartConfigProvider Lng={i18n.language ?? 'en'}>
      <Layout>
        <SiteHeader />
        <Content style={{ padding: '0 30px', marginTop: '10px' }}>
          <TabbedDashboard />
        </Content>
        <SiteFooter />
      </Layout>
    </ChartConfigProvider>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <BentoApp />
  </Provider>,
  rootElement
);
