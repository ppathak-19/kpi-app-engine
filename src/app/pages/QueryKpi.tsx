import { Surface, TitleBar } from "@dynatrace/strato-components-preview";
import React from "react";
import type { AppCompProps } from "types";

const QueryKpi: React.FC<AppCompProps> = () => {
  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>Query KPI</TitleBar.Title>
      </TitleBar>
    </Surface>
  );
};

export default QueryKpi;
