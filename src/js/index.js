// index.js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Books from "./Books";
import store from "./store";

const App = () => {
  return (
    <div>
      <Books/>
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  rootElement
);