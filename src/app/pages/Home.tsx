import React, { useEffect } from "react";
import type { AppCompProps } from "types";
import { getBeforePastDays, getLastMonth } from "../utils/timeConverters";

const Home: React.FC<AppCompProps> = () => {
  useEffect(() => {
    console.log(getBeforePastDays(7));
    console.log(getLastMonth(2));
  }, []);

  return (
    <div>
      <h3>This is Home Page</h3>
    </div>
  );
};

export default Home;
