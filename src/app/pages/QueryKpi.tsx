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
import { getLastMonth } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  /** Getting Metrices for Last 2 Days */
  const last2DaysData = useGetKPIMetrices({
    timeline: "now()-2d",
    shouldUseTimeFrame: false,
  });

  /** Getting Metrices for Last 7 Days */
  const last7DaysData = useGetKPIMetrices({
    timeline: "now()-7d",
    shouldUseTimeFrame: false,
  });

  /** Getting Metrices for Previous Month */
  const last30DaysData = useGetKPIMetrices({
    timeline: getLastMonth(),
    shouldUseTimeFrame: true,
  });

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>KPI for Problems</TitleBar.Title>
      </TitleBar>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Last 2 Days Data</Heading>
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
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Last 7 Days Data</Heading>
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
      </Flex>
      <Flex flexDirection="column" padding={20}>
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
      </Flex>
    </Surface>
  );
};

export default QueryKpi;
