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
import { useAppContext } from "../hooks/Context-API/AppContext";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";

const QueryKpi: React.FC<AppCompProps> = () => {
  /** States For Two Dropdowns for the app */
  const [selectTimeFrame, setSelectTimeFrame] = useState<string>("2");
  const [clickedAggreation, setClickedAggregation] =
    useState<aggregationsType>("min");

  /** taking values from context, to give thresholds to timeseries comp */
  // const { initialMttdValue, initialMttrValue } = useMetricsContext();
  const {
    state: { baseline },
  } = useAppContext();

  /** getting timeline1 */
  const getTimeLine1 = getPastDaysRange(selectTimeFrame);

  /** Getting Metrices for Last 2 Days */
  const daysData = useGetKPIMetrices({
    timeLine1: `${getTimeLine1}`,
    timeLine2: getBeforePastDays(selectTimeFrame),
  });

  /** taking value from `MetricsDetailSection` and setting selected timeframe value to state */
  const handleTimeFrameChange = (time: string) => {
    setSelectTimeFrame(time);
  };

  /** taking value from `MetricsDetailSection` and setting selected aggregation value to state */
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
        {/* First Container of app */}

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
