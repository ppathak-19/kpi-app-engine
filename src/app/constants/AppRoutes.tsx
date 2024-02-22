import React from "react";
import type { appRoutesType } from "types";
import Data from "../pages/Data";
import Home from "../pages/Home";
import ProblemEvents from "../pages/ProblemEvents";
import QueryKpi from "../pages/QueryKpi";

export const appRoutes: appRoutesType[] = [
  {
    path: "/",
    element: <Home />,
    label: "Home",
  },
  {
    path: "/data",
    element: <Data />,
    label: "Data Visualizations",
  },
  // {
  //   path: "/problem-events-v1",
  //   element: <ProblemEvents />,
  //   label: "DQL Problem Events",
  // },
  {
    path: "/kpi-query-v2",
    element: <QueryKpi />,
    label: "KPI Query V2",
  },
];
