import { Surface } from "@dynatrace/strato-components-preview/layouts-core";
import React, { useEffect } from "react";
import type { AppCompProps } from "types";
import { WarningIcon } from "@dynatrace/strato-icons";
import QueryKpi from "./QueryKpi";
import { getBeforePastDays, getLastMonth } from "../utils/timeConverters";

const Home: React.FC<AppCompProps> = () => {
  useEffect(() => {
    console.log(getBeforePastDays(7));
    console.log(getLastMonth(2));
  }, []);

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
