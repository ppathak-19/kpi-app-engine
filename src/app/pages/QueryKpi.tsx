import {
  Button,
  Container,
  Flex,
  Heading,
  TimeseriesChart,
} from "@dynatrace/strato-components-preview";
import Colors from "@dynatrace/strato-design-tokens/colors";
import { RefreshIcon } from "@dynatrace/strato-icons";
import React, { useEffect, useState } from "react";
import type { AppCompProps, aggregationsType } from "types";
import MetricDetailSection from "../components/MetricDetailSection";
import { CustomSelect } from "../components/ReusableComponents/CustomSelect";
import { MultiSelect } from "../components/ReusableComponents/MultiSelect";
import {
  aggregatorOptions,
  monthNames,
  timeFrameOptions,
} from "../constants/options";
import { useAppContext } from "../hooks/Context-API/AppContext";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { getPersistedAppState, setAppStatePersisted } from "../utils/appState";
import { giveTimeseriesData } from "../utils/giveTimeseriesData";
import { getBeforePastDays, getPastDaysRange } from "../utils/timeConverters";
import { emptyResponse } from "../constants/KpiFieldConstants";

const QueryKpi: React.FC<AppCompProps> = () => {
  const currentDate = new Date();

  const currentMonth = monthNames[currentDate.getMonth()];

  /** States For Two Dropdowns for the app */
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string>("1");
  const [selectedEventCategory, setSelectedEventCategory] = useState<string[]>(
    []
  );
  const [selectedAggregation, setSelectedAggregation] =
    useState<aggregationsType>("average");

  /** State For Cancelling the Query Based on Selected Timeframe */
  const [shouldCancelQuery, setshouldCancelQuery] = useState(false);

  /** State for storing useGetKPIMetrices Hook Data. temporary & actual State */
  const [tempKpiData, setTempKpiData] = useState(emptyResponse);
  const [kpiData, setKpiData] = useState(emptyResponse);

  /** taking values from context, to give thresholds to timeseries comp */
  const {
    state: { baseline },
    appKeys,
    setAppError,
  } = useAppContext();

  useEffect(() => {
    console.warn("inside uef queryKPI 1 .....", selectedTimeFrame);
    const giveCachedKPIData = async () => {
      if (selectedTimeFrame === "365") {
        console.log(`clicked ${selectedTimeFrame} tf`);

        if (appKeys.appKeys.includes(currentMonth)) {
          console.log(
            `key is there, for the ${currentMonth}, hence cancelling query and getting data from appState`
          );
          setshouldCancelQuery(true);

          // get value from state
          const valueFromPersistedState = await getPersistedAppState(
            currentMonth
          );

          //return the value
          return valueFromPersistedState;
        } else {
          console.log(
            "key is not there for cached month, hence save the data to appstate"
          );
          // console.log({ tempKpiData, kpiData, daysData });
          if (tempKpiData.isLoading === false) {
            //setting appState with key
            setAppStatePersisted({
              key: currentMonth,
              value: JSON.stringify(tempKpiData),
            });
          }
        }
      } else {
        console.log("clicked other timeframe", selectedTimeFrame);
        setshouldCancelQuery(false);
      }
    };

    giveCachedKPIData()
      .then((response) => {
        // console.log({ response, tempKpiData, kpiData });
        if (!!response && tempKpiData.isLoading === false) {
          setKpiData(response);
        }
      })
      .catch((e) => console.log(e));

    return () => console.warn("inside return of uef queryKPI 1 .....");
  }, [appKeys, tempKpiData, selectedTimeFrame, currentMonth]);

  /** taking value from `MetricsDetailSection` and setting selected timeframe value to state */
  const handleTimeFrameChange = (time: string) => {
    setSelectedTimeFrame(time);
    setKpiData(emptyResponse);
    // console.log({ time, selectedTimeFrame });
  };

  /** Getting Metrices Selected Timeframe */
  const daysData = useGetKPIMetrices({
    timeLine1: getPastDaysRange(selectedTimeFrame),
    timeLine2: getBeforePastDays(selectedTimeFrame),
    selectedEventCategory,
    shouldCancelQuery,
  });

  useEffect(() => {
    if (!!daysData && daysData.isLoading === false) {
      setKpiData(daysData);
      setTempKpiData(daysData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysData.isLoading]);

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

  /** taking value from `MetricsDetailSection` and setting selected aggregation value to state */
  const handleAggregationChange = (clickedVal: aggregationsType) => {
    setSelectedAggregation(clickedVal);
  };

  /** Passing Current Day Data  */
  const {
    timeseriesMttd: CurrentTimeseriesMttd,
    timeseriesMttr: CurrentTimeseriesMttr,
  } = giveTimeseriesData({
    queryResult: !!kpiData && kpiData.timeSeriesWithCurrentDayData,
    aggregation: selectedAggregation,
  });

  console.count();
  console.log("inside querykpi comp....");

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
              options={kpiData.categoryTypes}
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
              disabled={kpiData.isLoading}
              onClick={() => {
                kpiData.refetch.refetchMainQuery();
                kpiData.refetch.refetchSummarizationQuery1();
                kpiData.refetch.refetchSummarizationQuery2();
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
            daysData={kpiData}
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
            loading={kpiData.isLoading}
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
            loading={kpiData.isLoading}
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
