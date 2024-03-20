import { AppRoot, ToastContainer } from "@dynatrace/strato-components-preview";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import AppContextProvider from "./app/hooks/Context-API/AppContext";

ReactDOM.render(
  <AppRoot>
    <BrowserRouter basename="ui">
      <AppContextProvider>
        <App />
        <ToastContainer />
      </AppContextProvider>
    </BrowserRouter>
  </AppRoot>,
  document.getElementById("root")
);
