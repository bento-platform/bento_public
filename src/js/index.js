import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/SiteHeader';
import { store } from './store';
import { Layout } from 'antd';
const { Content } = Layout;
import 'antd/dist/antd.css';
import '../styles.css';
import '../public/locales/en/translation.js';
import '../public/locales/fr/translation.js';

import './i18n';

const BentoApp = () => {
  return (
    <Layout>
      <SiteHeader />
      <Content style={{ padding: '0 30px', marginTop: '10px' }}>
        <TabbedDashboard />
      </Content>
    </Layout>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <BentoApp />
  </Provider>,
  rootElement
);
