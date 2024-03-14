import {
  Container,
  Flex,
  Heading,
  TimeseriesChart,
} from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import type { AppCompProps, aggregationsType } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [selectTimeFrame, setSelectTimeFrame] = useState<string>("2");
  const [clickedAggreation, setClickedAggregation] =
    useState<aggregationsType>("min");

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

  const handleAggregationChange = (clickedVal: aggregationsType) => {
    setClickedAggregation(clickedVal);
  };

  /** Passing Current Day Data  */
  const {
    timeseriesMttd: CurrentTimeseriesMttd,
    timeseriesMttr: CurrentTimeseriesMttr,
  } = giveTimeseriesData({
    queryResult: !!daysData && daysData.timeSeriesWithCurrentDayData,
    aggregation: clickedAggreation,
  });

  return (
    <>
      <Flex>
        <MetricDetailSection
          daysData={daysData}
          selectedTimeFrame={selectTimeFrame}
          setSelectedTimeFrame={handleTimeFrameChange}
          clickedAggregation={clickedAggreation}
          setAggregationForTimeSeries={handleAggregationChange}
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
      {/* <Heading level={6}>Relative Days- Timeseries</Heading>
      <br /> */}
      {/* <Flex flexDirection="row" width="100%" justifyContent="space-around">
        <Container variant="minimal" width="40%">
          <TimeseriesChart
            data={RelativeTimeseriesMttd}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
        <Container variant="minimal" width="40%">
          <TimeseriesChart
            data={RelativeTimeseriesMttr}
            variant="area"
            loading={daysData.isLoading}
          />
        </Container>
      </Flex> */}
    </>
  );
};

export default QueryKpi;
