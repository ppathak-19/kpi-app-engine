import {
  Container,
  Flex,
  Heading,
  TimeseriesChart,
} from "@dynatrace/strato-components-preview";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React, { useState } from "react";
import type { AppCompProps, aggregationsType } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import { CustomSelect } from "../components/ReusableComponents/CustomSelect";
import { aggregatorOptions, timeFrameOptions } from "../constants/options";
import { useAppContext } from "../hooks/Context-API/AppContext";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  /** States For Two Dropdowns for the app */
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("2");
  const [selectedEventCategory, setSelectedEventCategory] =
    useState<string>("");
  const [selectedAggregation, setSelectedAggregation] =
    useState<aggregationsType>("min");

  /** taking values from context, to give thresholds to timeseries comp */
  const {
    state: { baseline },
  } = useAppContext();

  /** Getting Metrices Selected Timeframe */
  const daysData = useGetKPIMetrices({
    timeLine1: getPastDaysRange(selectedTimeFrame),
    timeLine2: getBeforePastDays(selectedTimeFrame),
    selectedEventCategory,
  });

  /** taking value from `MetricsDetailSection` and setting selected timeframe value to state */
  const handleTimeFrameChange = (time: string) => {
    setSelectedTimeFrame(time);
  };

  const handleEventTypeChange = (type: string) => {
    setSelectedEventCategory(type);
  };

  /** taking value from `MetricsDetailSection` and setting selected aggregation value to state */
  const handleAggregationChange = (clickedVal: aggregationsType) => {
    setSelectedAggregation(clickedVal);
  };

  /** Passing Current Day Data  */
  const {
    timeseriesMttd: CurrentTimeseriesMttd,
    timeseriesMttr: CurrentTimeseriesMttr,
  } = giveTimeseriesData({
    queryResult: !!daysData && daysData.timeSeriesWithCurrentDayData,
    aggregation: selectedAggregation,
  });

  console.log(timeFrameOptions, "options");

  return (
    <>
      <Flex flexDirection="column">
        {/* Custom Selects for the app */}
        <Flex justifyContent="space-between">
          <CustomSelect
            label="Select Aggregation"
            value={selectedAggregation}
            onChange={handleAggregationChange}
            options={aggregatorOptions}
          />
          <CustomSelect
            label="Select Event Type"
            value={selectedEventCategory}
            onChange={handleEventTypeChange}
            options={daysData.categoryTypes}
          />
          <CustomSelect
            label="Select Timeframe"
            value={selectedTimeFrame}
            onChange={handleTimeFrameChange}
            options={timeFrameOptions}
          />
        </Flex>

        {/* First Container of app */}
        <Flex flexDirection="column">
          <MetricDetailSection
            daysData={daysData}
            selectedTimeFrame={selectedTimeFrame}
            clickedAggregation={selectedAggregation}
          />
        </Flex>
      </Flex>
      <br />
      <br />
      <br />
      {/* Second part of app */}
      <Heading level={6}>Current Days- Timeseries</Heading>
      <br />
      <Flex flexDirection="row" width="100%" justifyContent="space-around">
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={CurrentTimeseriesMttd}
            variant="area"
            loading={daysData.isLoading}
          >
            <TimeseriesChart.Threshold
              data={{ value: baseline.mttd }}
              label="Baseline MTTD"
              color={Colors.Charts.Threshold.Bad.Default}
            />
            <TimeseriesChart.YAxis
              formatter={(value) => `${Math.round(value)} mins`}
            />
          </TimeseriesChart>
        </Container>
        <Container variant="minimal" width="42%">
          <TimeseriesChart
            data={CurrentTimeseriesMttr}
            variant="area"
            loading={daysData.isLoading}
          >
            <TimeseriesChart.Threshold
              data={{ value: baseline.mttr }}
              label="Baseline MTTR"
              color={Colors.Charts.Threshold.Bad.Default}
            />
            <TimeseriesChart.YAxis
              formatter={(value) => `${Math.round(value)} mins`}
            />
          </TimeseriesChart>
        </Container>
      </Flex>
    </>
  );
};

export default QueryKpi;
