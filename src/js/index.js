// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import TabbedDashboard from "./components/TabbedDashboard";
import Header from "./components/Header"
import store from "./store";
import { Layout } from 'antd';
const { Content } = Layout;

const BentoApp = () => {
  return (
    <Layout>
      <Content>
        <Header/>
        <TabbedDashboard/>
      </Content>
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