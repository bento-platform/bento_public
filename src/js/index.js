// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as V from 'victory';

import Dashboard from "./components/Dashboard";

import store from "./store";

import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

const BentoApp = () => {
  return (
    <Layout>
    <Layout>
      <Content>
        <Dashboard/>
      </Content>
    </Layout>
  </Layout>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <BentoApp/>
  </Provider>,
  rootElement
);