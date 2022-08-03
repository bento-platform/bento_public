// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TabbedDashboard from './components/TabbedDashboard';
import SiteHeader from './components/Header';
import { store } from './store';
import { Layout } from 'antd';
const { Header, Content } = Layout;
import 'antd/dist/antd.css';
import '../styles.css';

const BentoApp = () => {
  return (
    <Layout>
      <Header style={{ backgroundColor: '#fff' }}>
        <SiteHeader />
      </Header>
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
