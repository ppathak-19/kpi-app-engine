import {
  Flex,
  TimeseriesChart,
  convertQueryResultToTimeseries,
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
  // console.log(daysData);

  const ab = convertQueryResultToTimeseries(
    !!daysData.timeSeriesWithCurrentDayData
      ? daysData.timeSeriesWithCurrentDayData
      : { metadata: {}, records: [], types: [] }
  );

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
      <TimeseriesChart data={ab} variant="area" loading={daysData.isLoading} />
    </>
  );
};

export default QueryKpi;
