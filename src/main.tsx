import { AppRoot, ToastContainer } from "@dynatrace/strato-components-preview";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import AppContextProvider from "./app/hooks/Context-API/AppContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <AppRoot>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="ui">
        <AppContextProvider>
          <App />
          <ToastContainer />
        </AppContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </AppRoot>,
  document.getElementById("root")
);
