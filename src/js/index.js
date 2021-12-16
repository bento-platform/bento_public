// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as V from 'victory';

import Dashboard from "./components/Dashboard";

import store from "./store";

const BentoApp = () => {
  return (
    <div>
      <Dashboard/>
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <BentoApp/>
  </Provider>,
  rootElement
);