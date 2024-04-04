import {
  Button,
  Container,
  Flex,
  Heading,
  TimeseriesChart,
} from "@dynatrace/strato-components-preview";
import { RefreshIcon } from "@dynatrace/strato-icons";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React, { useEffect, useState } from "react";
import type { AppCompProps, aggregationsType } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import { CustomSelect } from "../components/ReusableComponents/CustomSelect";
import { aggregatorOptions, timeFrameOptions } from "../constants/options";
import { useAppContext } from "../hooks/Context-API/AppContext";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";
import { MultiSelect } from "../components/ReusableComponents/MultiSelect";

const QueryKpi: React.FC<AppCompProps> = () => {
  /** States For Two Dropdowns for the app */
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("2");
  const [selectedEventCategory, setSelectedEventCategory] = useState<string[]>(
    []
  );
  const [selectedAggregation, setSelectedAggregation] =
    useState<aggregationsType>("average");

  /** taking values from context, to give thresholds to timeseries comp */
  const {
    state: { baseline },
    setAppError,
    error,
  } = useAppContext();

  /** Getting Metrices Selected Timeframe */
  const daysData = useGetKPIMetrices({
    timeLine1: getPastDaysRange(selectedTimeFrame),
    timeLine2: getBeforePastDays(selectedTimeFrame),
    selectedEventCategory,
  });

  useEffect(() => {
    if (daysData.isError) {
      setAppError({
        isError: true,
        errorDetails: {
          code: 401,
          message: "Error In App Query...Please Try After Some Time.",
        },
      });
    }
  }, [daysData.isError, setAppError]);

  /** taking value from `MetricsDetailSection` and setting selected timeframe value to state */
  const handleTimeFrameChange = (time: string) => {
    setSelectedTimeFrame(time);
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

  console.count();

  return (
    <>
      <Flex flexDirection="column">
        {/* Custom Selects for the app */}
        <Flex justifyContent="space-between">
          <Flex alignItems="end">
            <CustomSelect
              label="Select Aggregation"
              value={selectedAggregation}
              onChange={handleAggregationChange}
              options={aggregatorOptions}
            />
            <MultiSelect
              value={selectedEventCategory}
              onChange={setSelectedEventCategory}
              options={daysData.categoryTypes}
            />
          </Flex>

          <Flex alignItems="end">
            <CustomSelect
              label="Select Timeframe"
              value={selectedTimeFrame}
              onChange={handleTimeFrameChange}
              options={timeFrameOptions}
            />
            <Button
              color="neutral"
              variant="emphasized"
              disabled={daysData.isLoading}
              onClick={() => {
                daysData.refetch.refetchMainQuery();
                daysData.refetch.refetchSummarizationQuery1();
                daysData.refetch.refetchSummarizationQuery2();
              }}
            >
              <Button.Prefix>
                <RefreshIcon />
              </Button.Prefix>
              Refetch
            </Button>
          </Flex>
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
            {daysData.isError && (
              <TimeseriesChart.ErrorState>
                {error.errorDetails.message}
              </TimeseriesChart.ErrorState>
            )}
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
            {daysData.isError && (
              <TimeseriesChart.ErrorState>
                {error.errorDetails.message}
              </TimeseriesChart.ErrorState>
            )}
          </TimeseriesChart>
        </Container>
      </Flex>
    </>
  );
};

export default QueryKpi;
