import {
  DataTable,
  Flex,
  Heading,
  Surface,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { queryKPITableColumn } from "../constants/problemTableColumns";

import useGetKPIQueryData from "../hooks/useGetKPIQueryData";
import { useGetTotalKpiDifference } from "../hooks/useGetTotalKpiDifference";

export interface ResultRecordProps {
  event?: {
    id: string;
  };
}

export const ProblemEvents = () => {
  function formatDate(date) {
    // leading zero if date/month is single digit
    const pad = (num) => (num < 10 ? "0" + num : num);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}T00:00:00Z`;
  }

  function getLastMonth() {
    var now = new Date();
    var lastday = new Date(now.getFullYear(), now.getMonth(), 0);
    var firstday = new Date(lastday.getFullYear(), lastday.getMonth(), 1);

    const formattedStartDate = formatDate(firstday);
    const formattedEndDate = formatDate(lastday);

    const timeframe = `${formattedStartDate}/${formattedEndDate}`;

    return timeframe;
  }

  const kpiData = useGetKPIQueryData({
    timeLine: "",
    shouldUseTimeFrame: false,
  });

  const [kpiTimeRangeArray, setKpiTimeRangeArray] = useState<any[]>([]);

  const [metricsStats] = useGetTotalKpiDifference(kpiData);

  console.log(getLastMonth(), "last month");

  useEffect(() => {
    console.log(kpiData, "stats");
  }, [kpiData]);

  console.log(kpiTimeRangeArray, "arrays");

  return (
    <div>
      <Surface>
        <TitleBar>
          <TitleBar.Title>KPI for Problems</TitleBar.Title>
        </TitleBar>
        <Flex flexDirection="column" padding={20}>
          <Heading level={2}>MTTD</Heading>
          <DataTable
            resizable
            fullWidth
            columns={queryKPITableColumn}
            data={[]}
          />
        </Flex>
        <Flex flexDirection="column" padding={20}>
          <Heading level={2}>MTTR</Heading>
          <DataTable
            resizable
            fullWidth
            columns={queryKPITableColumn}
            data={[]}
          />
        </Flex>
      </Surface>
    </div>
  );
};

export default ProblemEvents;
