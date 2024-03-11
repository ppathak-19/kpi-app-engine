import type { QueryResult, ResultRecord } from "@dynatrace-sdk/client-query";
import {
  Flex,
  Heading,
  TimeseriesChart,
  convertQueryResultToTimeseries,
} from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import type { AppCompProps } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { getBeforePastDays } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [selectTimeFrame, setSelectTimeFrame] = useState<string>("2");

  /** Getting Metrices for Last 2 Days */
  const daysData = useGetKPIMetrices({
    timeLine1: `now()-${selectTimeFrame}d`,
    shouldUseTimeFrame1: false,
    timeLine2: getBeforePastDays(Number(selectTimeFrame)),
    shouldUseTimeFrame2: true,
  });

  const handleTimeFrameChange = (time: string) => {
    setSelectTimeFrame(time);
  };

  // console.count();
  // console.log(daysData.isLoading);
  // console.log(daysData);

  /** This function will return the ResultRecord[], which we are using to differentiate kpi data from one single timeseries data */
  const giveRequiredKpi = (
    records: (ResultRecord | null)[],
    kpi: "mttr" | "mttd"
  ): ResultRecord[] => {
    const firstObj = records[0];
    const res = {
      [`avg(${kpi}Time)`]: !!firstObj
        ? firstObj?.[`avg(${kpi}Time)`]
        : ([] as number[]),
      [`min(${kpi}Time)`]: !!firstObj
        ? firstObj?.[`min(${kpi}Time)`]
        : ([] as number[]),
      [`max(${kpi}Time)`]: !!firstObj
        ? firstObj?.[`max(${kpi}Time)`]
        : ([] as number[]),
      ["timeframe"]: !!firstObj ? firstObj?.["timeframe"] : ([] as number[]),
      ["interval"]: !!firstObj ? firstObj?.["interval"] : "",
    };
    // console.log({ records, firstObj, res });

    return [res];
  };

  /** QueryResult for MTTR  */
  const mttrData =
    !!daysData && daysData.timeSeriesWithCurrentDayData
      ? ({
          metadata:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? daysData.timeSeriesWithCurrentDayData.metadata
              : {},
          types:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? daysData.timeSeriesWithCurrentDayData.types
              : [],
          records:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? giveRequiredKpi(
                  daysData.timeSeriesWithCurrentDayData.records,
                  "mttr"
                )
              : [],
        } as QueryResult)
      : { metadata: {}, records: [], types: [] };

  /** QueryResult for MTTD  */
  const mttdData =
    !!daysData && daysData.timeSeriesWithCurrentDayData
      ? ({
          metadata:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? daysData.timeSeriesWithCurrentDayData.metadata
              : {},
          types:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? daysData.timeSeriesWithCurrentDayData.types
              : [],
          records:
            !!daysData && daysData.timeSeriesWithCurrentDayData
              ? giveRequiredKpi(
                  daysData.timeSeriesWithCurrentDayData.records,
                  "mttd"
                )
              : [],
        } as QueryResult)
      : { metadata: {}, records: [], types: [] };

  /** Using above results and passing to utility function */
  const TimeseriesMttr = convertQueryResultToTimeseries(mttrData);
  const TimeseriesMttd = convertQueryResultToTimeseries(mttdData);

  return (
    <>
      <Flex>
        <MetricDetailSection
          daysData={daysData}
          selectedTimeFrame={selectTimeFrame}
          setSelectedTimeFrame={handleTimeFrameChange}
        />
      </Flex>
      <br />
      <br />
      <br />
      <Heading level={5}>Timeseries- MTTD</Heading>
      <TimeseriesChart
        data={TimeseriesMttd}
        variant="area"
        loading={daysData.isLoading}
      />
      <br />
      <br />
      <Heading level={5}>Timeseries - MTTR </Heading>
      <TimeseriesChart
        data={TimeseriesMttr}
        variant="area"
        loading={daysData.isLoading}
      />
    </>
  );
};

export default QueryKpi;
