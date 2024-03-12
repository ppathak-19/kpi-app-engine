import {
  Container,
  Flex,
  Heading,
  TimeseriesChart,
} from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import type { AppCompProps } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [selectTimeFrame, setSelectTimeFrame] = useState<string>("2");

  const getTimeLine1 = getPastDaysRange(selectTimeFrame);

  /** Getting Metrices for Last 2 Days */
  const daysData = useGetKPIMetrices({
    timeLine1: `now()-${getTimeLine1}d`,
    shouldUseTimeFrame1: false,
    timeLine2: getBeforePastDays(selectTimeFrame),
    shouldUseTimeFrame2: true,
  });

  const handleTimeFrameChange = (time: string) => {
    setSelectTimeFrame(time);
  };

  /** Passing Current Day Data  */
  const {
    timeseriesMttd: CurrentTimeseriesMttd,
    timeseriesMttr: CurrentTimeseriesMttr,
  } = giveTimeseriesData(!!daysData && daysData.timeSeriesWithCurrentDayData);

  /** Passing Previous Data */
  const {
    timeseriesMttd: RelativeTimeseriesMttd,
    timeseriesMttr: RelativeTimeseriesMttr,
  } = giveTimeseriesData(!!daysData && daysData.timeSeriesWithPreviousDayData);

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
      <Heading level={6}>Current Days- Timeseries</Heading>
      <br />
      <Flex flexDirection="row" width="100%" justifyContent="space-around">
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={CurrentTimeseriesMttd}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={CurrentTimeseriesMttr}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
      </Flex>
      <br />
      <br />
      <Heading level={6}>Relative Days- Timeseries</Heading>
      <br />
      <Flex flexDirection="row" width="100%" justifyContent="space-around">
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={RelativeTimeseriesMttd}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={RelativeTimeseriesMttr}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
      </Flex>
    </>
  );
};

export default QueryKpi;
