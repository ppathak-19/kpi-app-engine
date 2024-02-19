import { Page } from "@dynatrace/strato-components-preview";
import React from "react";
import { Route, Routes } from "react-router-dom";
import type { AppCompProps } from "types";
import Header from "./components/Header";
import { appRoutes } from "./constants/AppRoutes";

const App: React.FC<AppCompProps> = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          {appRoutes.map((EachRoute) => (
            <Route
              key={EachRoute.path}
              path={EachRoute.path}
              element={EachRoute.element}
            />
          ))}
        </Routes>
      </Page.Main>
    </Page>
  );
};

export default App;
