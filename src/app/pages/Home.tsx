import { Surface } from "@dynatrace/strato-components-preview/layouts-core";
import React from "react";
import type { AppCompProps } from "types";
import { WarningIcon } from "@dynatrace/strato-icons";
import QueryKpi from "./QueryKpi";

const Home: React.FC<AppCompProps> = () => {
  const isUserInputtedData = true;

  return (
    <Surface>
      {isUserInputtedData ? (
        <>
          <QueryKpi />
        </>
      ) : (
        <>
          <WarningIcon />
        </>
      )}
    </Surface>
  );
};

export default Home;
