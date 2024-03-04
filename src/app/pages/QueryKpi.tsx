import {
  DataTable,
  Flex,
  Heading,
  Surface,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import React from "react";
import type { AppCompProps } from "types";
import { queryKPITableColumnV2 } from "../constants/problemTableColumns";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { getBeforePastDays } from "../utils/timeConverters";
import KPICategoryBarChart from "../components/KPICategoryBarChart";

const QueryKpi: React.FC<AppCompProps> = () => {
  /** Getting Metrices for Last 2 Days */
  const last2DaysData = useGetKPIMetrices({
    timeLine1: "now()-2d",
    shouldUseTimeFrame1: false,
    timeLine2: getBeforePastDays(2),
    shouldUseTimeFrame2: true,
  });

  // console.log({ last2DaysData });

  /** Getting Metrices for Last 7 Days */
  // const last7DaysData = useGetKPIMetrices({
  //   timeLine1: "now()-7d",
  //   shouldUseTimeFrame1: false,
  //   timeLine2: getBeforePastDays(7),
  //   shouldUseTimeFrame2: true,
  // });

  /** Getting Metrices for Previous Month */
  // const last30DaysData = useGetKPIMetrices({
  //   timeline: getLastMonth(),
  //   shouldUseTimeFrame: true,
  // });

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>KPI With MTTD, MTTR</TitleBar.Title>
      </TitleBar>
      <Flex flexDirection="column" padding={20}>
        <KPICategoryBarChart data={last2DaysData} />
      </Flex>
      <br />
      <Flex flexDirection="column" padding={20}>
        <Heading level={4}>Last 2 Days Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last2DaysData.isLoading}
          data={!!last2DaysData ? [last2DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex>
      <br />
      {/* <Flex flexDirection="column" padding={20}>
        <Heading level={4}>Last 7 Days Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last7DaysData.isLoading}
          data={!!last7DaysData ? [last7DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex> */}
      <br />
      {/*  <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Previous Month Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last30DaysData.isLoading}
          data={!!last30DaysData ? [last30DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex> */}
      <p>1st Value - Current Days Value in minutes</p>
      <p>2nd Value - Comparison with baseline in percentage</p>
      <p>3rd Value - Previous Days Value in minutes</p>
      <p>
        4rth Value - Comparison with previous day data(2 days before past 2 day)
        and current day data in percentage
      </p>
    </Surface>
  );
};

export default QueryKpi;
