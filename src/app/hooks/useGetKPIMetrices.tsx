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
  medianMTTD,
  medianMTTR,
} from "../constants/KpiFieldConstants";
import {
  giveCostSavingsData,
  calculatePercentage,
} from "../utils/calculations";
import { getAllEventCategoryTypes, processRecords } from "../utils/helpers";
import { useAppContext } from "./Context-API/AppContext";
import useGetKPIQueryData from "./useGetKPIQueryData";
import useGetSummarizationData from "./useGetSummarizationData";

/** This Hook Gives the Required Data for Table */
const useGetKPIMetrices = (props: QueryProps) => {
  const { timeLine1, timeLine2, selectedEventCategory, shouldCancelQuery } =
    props;

  console.log("\n");
  console.log("inside useGetKPIMetrices hook...");

  const {
    queryResponseWithTimeLine1: q1,
    queryResponseWithTimeLine2: q2,
    isLoading: mainQueryLoading,
    isErrorInMainQuery,
    refetch,
  } = useGetKPIQueryData({
    timeLine1,
    timeLine2,
    shouldCancelQuery,
  });

  /** Taking baseline values from useContext  */
  const {
    state: { baseline, ignoreCases, salary },
  } = useAppContext();

  /** State For Storing all data i.e, current day & previous day */
  const [storeCurrentDay, setStoreCurrentDay] = useState<ResultRecord[]>([]);
  const [storePreviousDay, setStorePreviousDay] = useState<ResultRecord[]>([]);

  useEffect(() => {
    console.warn("inside uef of useGetKPIMetrices hook...");
    if (q1?.records) {
      console.warn("inside if cond of useGetKPIMetrices hook...");
      const data1 = processRecords({
        records: q1.records,
        selectedEventCategory: selectedEventCategory,
        ignore: ignoreCases.valuesInMinutes,
      });
      // console.log(data1, "stored data for q1");

      setStoreCurrentDay(data1 as ResultRecord[]);
    }

    if (q2?.records) {
      console.warn("inside if cond of useGetKPIMetrices hook...");
      const data2 = processRecords({
        records: q2.records,
        selectedEventCategory: selectedEventCategory,
        ignore: ignoreCases.valuesInMinutes,
      });
      // console.log(data2, "stored data for q2");

      setStorePreviousDay(data2 as ResultRecord[]);
    }

    return () => {
      console.warn("inside uef return of useGetKPIMetrices hook...");
      setStoreCurrentDay([]);
      setStorePreviousDay([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q1, q2, selectedEventCategory, ignoreCases]);

  /** After Quering the data, take all the mttr,mttd list in an array and pass to useGetSummarizationData() hook to get the required metrices */

  // console.log({ storeCurrentDay, storePreviousDay });
  console.log(`\n near useSumm hook 1`);
  //* passing current days mttd,mttr values so we get avg,min,etc.. for current days data
  const metricData1 = useGetSummarizationData({
    queryData: storeCurrentDay,
    timeLine: timeLine1,
    shouldCancelQuery,
  });

  console.log(`\n near useSumm hook 2`);
  //* passing previous days mttd,mttr values so we get avg,min,etc.. for previous days data
  const metricData2 = useGetSummarizationData({
    queryData: storePreviousDay,
    timeLine: timeLine2,
    shouldCancelQuery,
  });

  // console.log({ metricData1, metricData2 });

  const baselineMTTD = baseline.mttd;
  const baselineMTTR = baseline.mttr;

  const responseWithCurrentDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [averageMTTD]: !!metricData1 ? metricData1.averageMTTD : "0",
    [medianMTTD]: !!metricData1 ? metricData1.medianMTTD : "0",

    /** MTTR Data */
    [averageMTTR]: !!metricData1 ? metricData1.averageMTTR : "0",
    [medianMTTR]: !!metricData1 ? metricData1.medianMTTR : "0",
  };

  const responseWithPreviousDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [averageMTTD]: !!metricData2 ? metricData2.averageMTTD : "0",
    [medianMTTD]: !!metricData2 ? metricData2.medianMTTD : "0",

    /** MTTR Data */
    [averageMTTR]: !!metricData2 ? metricData2.averageMTTR : "0",
    [medianMTTR]: !!metricData2 ? metricData2.medianMTTR : "0",
  };

  /** To cal % with respect to baseline -> divide metricData by baseline value from context */
  const responseInPercentageWithBaseline: ResponseWithPercentages = {
    [averageMTTD]: calculatePercentage(
      metricData1.averageMTTDInNum,
      baselineMTTD
    ),
    [medianMTTD]: calculatePercentage(
      metricData1.medianMTTDInNum,
      baselineMTTD
    ),

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
    [averageMTTD]: calculatePercentage(
      metricData1.averageMTTDInNum,
      metricData2.averageMTTDInNum
    ),
    [medianMTTD]: calculatePercentage(
      metricData1.medianMTTDInNum,
      metricData2.medianMTTDInNum
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
    [averageMTTD]: giveCostSavingsData({
      kpi: metricData1.averageMTTDInNum,
      baseline: baselineMTTD,
      perHourSalary: salary.salaryValue,
      noOfPeopleWorking: salary.defaultPeopleWorkingOnAProblem,
    }),
    [medianMTTD]: giveCostSavingsData({
      kpi: metricData1.medianMTTDInNum,
      baseline: baselineMTTD,
      perHourSalary: salary.salaryValue,
      noOfPeopleWorking: salary.defaultPeopleWorkingOnAProblem,
    }),

    // MTTR Cost Saving Values
    [averageMTTR]: giveCostSavingsData({
      kpi: metricData1.averageMTTRInNum,
      baseline: baselineMTTR,
      perHourSalary: salary.salaryValue,
      noOfPeopleWorking: salary.defaultPeopleWorkingOnAProblem,
    }),
    [medianMTTR]: giveCostSavingsData({
      kpi: metricData1.medianMTTRInNum,
      baseline: baselineMTTR,
      perHourSalary: salary.salaryValue,
      noOfPeopleWorking: salary.defaultPeopleWorkingOnAProblem,
    }),
  };

  /** Getting all the category types from two query records */
  const categoryTypes = getAllEventCategoryTypes(q1, q2);

  console.log("near finalresponse");
  /** Final Response */
  const finalResponse: RequiredDataResponse = {
    /** Other Info */
    isLoading:
      mainQueryLoading || metricData1.isLoading || metricData2.isLoading,
    isError: metricData1.isError || metricData2.isError || isErrorInMainQuery,

    /** Other calculations */
    categoryTypes,
    responseInPercentageWithBaseline,
    responseInPercentageWithPreviousDay,
    responseWithCurrentDayData,
    responseWithPreviousDayData,
    responseWithCostSavings,
    timeSeriesWithCurrentDayData: metricData1.dataTimeseries,
    timeSeriesWithPreviousDayData: metricData2.dataTimeseries,
    refetch: {
      refetchMainQuery: refetch,
      refetchSummarizationQuery1: metricData1.refetch,
      refetchSummarizationQuery2: metricData2.refetch,
    },
  };
  console.log("near return of hook useGetKPI");
  // console.log({ finalResponse });
  return finalResponse;
};

export default useGetKPIMetrices;
