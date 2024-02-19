import { Page } from "@dynatrace/strato-components-preview";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Data from "./pages/Data";
import Home from "./pages/Home";
import { ProblemEvents } from "./pages/ProblemEvents";

export const App = () => {
  return (
    <Page>
      <Page.Header>
        <Header />
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<Data />} />
          <Route path="/problem-events" element={<ProblemEvents />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
