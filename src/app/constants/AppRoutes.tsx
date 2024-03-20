import React from "react";
import type { appRoutesType } from "types";
import Home from "../pages/Home";
import QueryKpi from "../pages/QueryKpi";

export const appRoutes: appRoutesType[] = [
  {
    path: "/",
    element: <Home setModalState={() => false} />,
    label: "Home",
  },
  {
    path: "/kpi-query-v2",
    // path: "/",
    element: <QueryKpi />,
    label: "KPI Query V2",
  },
];
