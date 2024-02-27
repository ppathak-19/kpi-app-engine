import { AppRoot } from "@dynatrace/strato-components-preview";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { MetricsProvider } from "./app/hooks/context/MetricsContext";

ReactDOM.render(
  <AppRoot>
    <BrowserRouter basename="ui">
      <MetricsProvider>
        <App />
      </MetricsProvider>
    </BrowserRouter>
  </AppRoot>,
  document.getElementById("root")
);
