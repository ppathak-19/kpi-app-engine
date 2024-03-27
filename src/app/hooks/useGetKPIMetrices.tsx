import type { ResultRecord } from "@dynatrace-sdk/client-query";
import { useEffect, useState } from "react";
import type {
  QueryProps,
  RequiredDataResponse,
  ResponseWithCostSavingsType,
  ResponseWithMetricesData,
  ResponseWithPercentages,
} from "types";
import {
  averageMTTD,
  averageMTTR,
  maxMTTD,
  maxMTTR,
  medianMTTD,
  medianMTTR,
  minMTTD,
  minMTTR,
} from "../constants/KpiFieldConstants";
import {
  calculateDiffInHours,
  calculatePercentage,
} from "../utils/calculations";
import { processRecords } from "../utils/helpers";
import { useAppContext } from "./Context-API/AppContext";
import useGetKPIQueryData from "./useGetKPIQueryData";
import useGetSummarizationData from "./useGetSummarizationData";

/** This Hook Gives the Required Data for Table */
const useGetKPIMetrices = (props: QueryProps) => {
  const { timeLine1, timeLine2, selectedEventCategory } = props;

  const {
    categoryTypes,
    queryResponseWithTimeLine1: q1,
    queryResponseWithTimeLine2: q2,
    isLoading: mainQueryLoading,
    refetch,
  } = useGetKPIQueryData({
    timeLine1,
    timeLine2,
  });

  /** Taking baseline values from useContext  */
  const {
    state: { baseline, ignoreCases, salary },
  } = useAppContext();

  /** State For Storing all data i.e, current day & previous day */
  const [storeCurrentDay, setStoreCurrentDay] = useState<ResultRecord[]>([]);
  const [storePreviousDay, setStorePreviousDay] = useState<ResultRecord[]>([]);

  useEffect(() => {
    if (q1?.records) {
      const data1 = processRecords({
        records: q1.records,
        selectedEventCategory: selectedEventCategory,
        ignore: ignoreCases,
      });
      // console.log(data1, "stored data for q1");

      setStoreCurrentDay(data1 as ResultRecord[]);
    }

    if (q2?.records) {
      const data2 = processRecords({
        records: q2.records,
        selectedEventCategory: selectedEventCategory,
        ignore: ignoreCases,
      });
      // console.log(data2, "stored data for q2");

      setStorePreviousDay(data2 as ResultRecord[]);
    }
  }, [q1, q2, selectedEventCategory, ignoreCases]);

  /** After Quering the data, take all the mttr,mttd list in an array and pass to useGetSummarizationData() hook to get the required metrices */

  //* passing current days mttd,mttr values so we get avg,min,etc.. for current days data
  const metricData1 = useGetSummarizationData({
    queryData: storeCurrentDay,
    timeLine: timeLine1,
  });

  //* passing previous days mttd,mttr values so we get avg,min,etc.. for previous days data
  const metricData2 = useGetSummarizationData({
    queryData: storePreviousDay,
    timeLine: timeLine2,
  });

  const baselineMTTD = baseline.mttd;
  const baselineMTTR = baseline.mttr;

  const responseWithCurrentDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [minMTTD]: !!metricData1 ? metricData1.minMTTD : "0",
    [maxMTTD]: !!metricData1 ? metricData1.maxMTTD : "0",
    [averageMTTD]: !!metricData1 ? metricData1.averageMTTD : "0",
    [medianMTTD]: !!metricData1 ? metricData1.medianMTTD : "0",

    /** MTTR Data */
    [minMTTR]: !!metricData1 ? metricData1.minMTTR : "0",
    [maxMTTR]: !!metricData1 ? metricData1.maxMTTR : "0",
    [averageMTTR]: !!metricData1 ? metricData1.averageMTTR : "0",
    [medianMTTR]: !!metricData1 ? metricData1.medianMTTR : "0",
  };

  const responseWithPreviousDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [minMTTD]: !!metricData2 ? metricData2.minMTTD : "0",
    [maxMTTD]: !!metricData2 ? metricData2.maxMTTD : "0",
    [averageMTTD]: !!metricData2 ? metricData2.averageMTTD : "0",
    [medianMTTD]: !!metricData2 ? metricData2.medianMTTD : "0",

    /** MTTR Data */
    [minMTTR]: !!metricData2 ? metricData2.minMTTR : "0",
    [maxMTTR]: !!metricData2 ? metricData2.maxMTTR : "0",
    [averageMTTR]: !!metricData2 ? metricData2.averageMTTR : "0",
    [medianMTTR]: !!metricData2 ? metricData2.medianMTTR : "0",
  };

  /** To cal % with respect to baseline -> divide metricData by baseline value from context */
  const responseInPercentageWithBaseline: ResponseWithPercentages = {
    [minMTTD]: calculatePercentage(metricData1.minMTTDInNum, baselineMTTD),
    [maxMTTD]: calculatePercentage(metricData1.maxMTTDInNum, baselineMTTD),
    [averageMTTD]: calculatePercentage(
      metricData1.averageMTTDInNum,
      baselineMTTD
    ),
    [medianMTTD]: calculatePercentage(
      metricData1.medianMTTDInNum,
      baselineMTTD
    ),

    [minMTTR]: calculatePercentage(metricData1.minMTTRInNum, baselineMTTR),
    [maxMTTR]: calculatePercentage(metricData1.maxMTTRInNum, baselineMTTR),
    [averageMTTR]: calculatePercentage(
      metricData1.averageMTTRInNum,
      baselineMTTR
    ),
    [medianMTTR]: calculatePercentage(
      metricData1.medianMTTRInNum,
      baselineMTTR
    ),
  };

  /** To cal % with respect to current days & relative day  */
  const responseInPercentageWithPreviousDay: ResponseWithPercentages = {
    [minMTTD]: calculatePercentage(
      metricData1.minMTTDInNum,
      metricData2.minMTTDInNum
    ),
    [maxMTTD]: calculatePercentage(
      metricData1.maxMTTDInNum,
      metricData2.maxMTTDInNum
    ),
    [averageMTTD]: calculatePercentage(
      metricData1.averageMTTDInNum,
      metricData2.averageMTTDInNum
    ),
    [medianMTTD]: calculatePercentage(
      metricData1.medianMTTDInNum,
      metricData2.medianMTTDInNum
    ),

    [minMTTR]: calculatePercentage(
      metricData1.minMTTRInNum,
      metricData2.minMTTRInNum
    ),
    [maxMTTR]: calculatePercentage(
      metricData1.maxMTTRInNum,
      metricData2.maxMTTRInNum
    ),
    [averageMTTR]: calculatePercentage(
      metricData1.averageMTTRInNum,
      metricData2.averageMTTRInNum
    ),
    [medianMTTR]: calculatePercentage(
      metricData1.medianMTTRInNum,
      metricData2.medianMTTRInNum
    ),
  };

  /** To Calculate Cost Savings */
  const responseWithCostSavings: ResponseWithCostSavingsType = {
    // MTTD Cost Saving Values
    [minMTTD]: calculateDiffInHours(
      metricData1.minMTTDInNum,
      baselineMTTD,
      salary
    ),
    [maxMTTD]: calculateDiffInHours(
      metricData1.maxMTTDInNum,
      baselineMTTD,
      salary
    ),
    [averageMTTD]: calculateDiffInHours(
      metricData1.averageMTTDInNum,
      baselineMTTD,
      salary
    ),
    [medianMTTD]: calculateDiffInHours(
      metricData1.medianMTTDInNum,
      baselineMTTD,
      salary
    ),

    // MTTR Cost Saving Values
    [minMTTR]: calculateDiffInHours(
      metricData1.minMTTRInNum,
      baselineMTTR,
      salary
    ),
    [maxMTTR]: calculateDiffInHours(
      metricData1.maxMTTRInNum,
      baselineMTTR,
      salary
    ),
    [averageMTTR]: calculateDiffInHours(
      metricData1.averageMTTRInNum,
      baselineMTTR,
      salary
    ),
    [medianMTTR]: calculateDiffInHours(
      metricData1.minMTTRInNum,
      baselineMTTR,
      salary
    ),
  };

  // console.log({ responseWithCostSavings });

  /** Final Response */
  const finalResponse: RequiredDataResponse = {
    categoryTypes,
    /** Other Info */
    isLoading:
      mainQueryLoading || metricData1.isLoading || metricData2.isLoading,
    isError: metricData1.isError || metricData2.isError,

    /** Other calculations */
    responseInPercentageWithBaseline,
    responseInPercentageWithPreviousDay,
    responseWithCurrentDayData,
    responseWithPreviousDayData,
    timeSeriesWithCurrentDayData: metricData1.dataTimeseries,
    timeSeriesWithPreviousDayData: metricData2.dataTimeseries,
    refetch: {
      refetchMainQuery: refetch,
      refetchSummarizationQuery1: metricData1.refetch,
      refetchSummarizationQuery2: metricData2.refetch,
    },
    responseWithCostSavings,
  };
  return finalResponse;
};

export default useGetKPIMetrices;
