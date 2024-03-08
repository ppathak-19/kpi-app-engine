import {
  Flex,
  Heading,
  TimeseriesChart,
  convertQueryResultToTimeseries,
  convertToTimeseries,
} from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import type { AppCompProps } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { getBeforePastDays } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [selectTimeFrame, setSelectTimeFrame] = useState<string | null>("2");

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
  // console.log(daysData.timeSeriesWithCurrentDayData);

  // const currentDayTimeseries = convertQueryResultToTimeseries(
  //   !!daysData.timeSeriesWithCurrentDayData
  //     ? daysData.timeSeriesWithCurrentDayData
  //     : { metadata: {}, records: [], types: [] }
  // );

  // const previousDayTimeseries = convertQueryResultToTimeseries(
  //   !!daysData.timeSeriesWithPreviousDayData
  //     ? daysData.timeSeriesWithPreviousDayData
  //     : { metadata: {}, records: [], types: [] }
  // );

  const { records, types } = daysData.timeSeriesWithCurrentDayData;

  const timeseries1 = convertToTimeseries(records, types, [
    "res",
    "dt.davis.event_ids",
    "event.id",
  ]);

  const timeseries2 = convertQueryResultToTimeseries(
    daysData.timeSeriesWithCurrentDayData
  );

  // console.log(timeseries1);

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
      <Heading level={5}>Timeseries</Heading>
      <TimeseriesChart
        data={timeseries1}
        variant="area"
        loading={daysData.isLoading}
      />
      <br />
      <br />
      <TimeseriesChart
        data={timeseries2}
        variant="area"
        loading={daysData.isLoading}
      />
    </>
  );
};

export default QueryKpi;
