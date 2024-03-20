import type { ResultRecord } from "@dynatrace-sdk/client-query";
import { useEffect, useState } from "react";
import type {
  QueryProps,
  RequiredDataResponse,
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
import { calculatePercentage } from "../utils/calculations";
import {
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";
import { useAppContext } from "./Context-API/AppContext";
import useGetKPIQueryData from "./useGetKPIQueryData";
import useGetSummarizationData from "./useGetSummarizationData";

/** This Hook Gives the Required Data for Table */
const useGetKPIMetrices = (props: QueryProps) => {
  const { timeLine1, timeLine2 } = props;

  const {
    queryResponseWithTimeLine1: q1,
    queryResponseWithTimeLine2: q2,
    isLoading: mainQueryLoading,
  } = useGetKPIQueryData({
    timeLine1,
    timeLine2,
  });

  /** State For Storing all data i.e, current day & previous day */
  const [storeCurrentDay, setStoreCurrentDay] = useState<ResultRecord[]>([]);
  const [storePreviousDay, setStorePreviousDay] = useState<ResultRecord[]>([]);

  useEffect(() => {
    if (q1?.records) {
      const data1 = q1?.records
        .map((eachR) => {
          /** Here we are calculating the No.Of time Diff in minutes b/w event start and res.event start
           *
           * t0 -> res.event.start
           * t1 -> event.start
           * t2 -> event.end
           *
           */
          const mttd = formatProblemTimeWithDiff(
            convertUTCToDate(eachR?.["event.start"] as string),
            convertUTCToDate(eachR?.["res.event.start"] as string)
          );

          /** Here we are calculating the No.Of time Diff in minutes b/w event start & event end */
          const mttr = formatProblemTimeWithDiff(
            convertUTCToDate(eachR?.["event.start"] as string),
            convertUTCToDate(eachR?.["event.end"] as string)
          );

          return {
            ...eachR,
            mttdTime: mttd,
            mttrTime: mttr,
          };
        })
        .filter((eachR) => Number(eachR.mttrTime) > 5); // filtering mttr values less than 5 min,as said by florent

      setStoreCurrentDay(data1);
    }
    if (q2?.records) {
      const data2 = q2?.records
        .map((eachR) => {
          /** Here we are calculating the No.Of time Diff in minutes b/w event start and res.event start
           *
           * t0 -> res.event.start
           * t1 -> event.start
           * t2 -> event.end
           *
           */
          const mttd = formatProblemTimeWithDiff(
            convertUTCToDate(eachR?.["event.start"] as string),
            convertUTCToDate(eachR?.["res.event.start"] as string)
          );

          /** Here we are calculating the No.Of time Diff in minutes b/w event start & event end */
          const mttr = formatProblemTimeWithDiff(
            convertUTCToDate(eachR?.["event.start"] as string),
            convertUTCToDate(eachR?.["event.end"] as string)
          );

          return {
            ...eachR,
            mttdTime: mttd,
            mttrTime: mttr,
          };
        })
        .filter((eachR) => Number(eachR.mttrTime) > 5); // filtering mttr values less than 5 min,as said by florent

      setStorePreviousDay(data2);
    }
  }, [q1, q2]);

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

  /** Taking baseline values from useContext  */
  const {
    state: { baseline },
  } = useAppContext();
  const baselineMTTD = baseline.mttd;
  const baselineMTTR = baseline.mttr;

  const responseWithCurrentDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [minMTTD]: !!metricData1 ? metricData1.minMTTD : "0",
    [maxMTTD]: !!metricData1 ? metricData1.maxMTTD : "0",
    [averageMTTD]: !!metricData1 ? metricData1.averageMTTD : "0",
    [medianMTTD]: !!metricData1 ? metricData1.medianMTTD : "0",

    // minMTTDInNumber: !!metricData1 ? metricData1.minMTTDInNum : 0,
    // maxMTTDInNum: !!metricData1 ? metricData1.maxMTTDInNum : 0,
    // averageMTTDInNum: !!metricData1 ? metricData1.averageMTTDInNum : 0,
    // medianMTTDInNum: !!metricData1 ? metricData1.medianMTTDInNum : 0,

    /** MTTR Data */
    [minMTTR]: !!metricData1 ? metricData1.minMTTR : "0",
    [maxMTTR]: !!metricData1 ? metricData1.maxMTTR : "0",
    [averageMTTR]: !!metricData1 ? metricData1.averageMTTR : "0",
    [medianMTTR]: !!metricData1 ? metricData1.medianMTTR : "0",

    // minMTTRInNumber: !!metricData1 ? metricData1.minMTTRInNum : 0,
    // maxMTTRInNum: !!metricData1 ? metricData1.maxMTTRInNum : 0,
    // averageMTTRInNum: !!metricData1 ? metricData1.averageMTTRInNum : 0,
    // medianMTTRInNum: !!metricData1 ? metricData1.medianMTTRInNum : 0,
  };

  const responseWithPreviousDayData: ResponseWithMetricesData = {
    /** MTTD Data */
    [minMTTD]: !!metricData2 ? metricData2.minMTTD : "0",
    [maxMTTD]: !!metricData2 ? metricData2.maxMTTD : "0",
    [averageMTTD]: !!metricData2 ? metricData2.averageMTTD : "0",
    [medianMTTD]: !!metricData2 ? metricData2.medianMTTD : "0",

    // minMTTDInNumber: !!metricData2 ? metricData2.minMTTDInNum : 0,
    // maxMTTDInNum: !!metricData2 ? metricData2.maxMTTDInNum : 0,
    // averageMTTDInNum: !!metricData2 ? metricData2.averageMTTDInNum : 0,
    // medianMTTDInNum: !!metricData2 ? metricData2.medianMTTDInNum : 0,

    /** MTTR Data */
    [minMTTR]: !!metricData2 ? metricData2.minMTTR : "0",
    [maxMTTR]: !!metricData2 ? metricData2.maxMTTR : "0",
    [averageMTTR]: !!metricData2 ? metricData2.averageMTTR : "0",
    [medianMTTR]: !!metricData2 ? metricData2.medianMTTR : "0",

    // minMTTRInNumber: !!metricData2 ? metricData2.minMTTRInNum : 0,
    // maxMTTRInNum: !!metricData2 ? metricData2.maxMTTRInNum : 0,
    // averageMTTRInNum: !!metricData2 ? metricData2.averageMTTRInNum : 0,
    // medianMTTRInNum: !!metricData2 ? metricData2.medianMTTRInNum : 0,
  };

  /** To cal % with respect to baseline -> divide metricData by baseline value from context */
  // if metricData is 5, baseline is 10 -> [1 - (5/10)] * 100 =>
  // [1 - (1/2)] * 100
  // (1/2) * 100 => 50%
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
  // if relative is 10, current is 100 -> [(10/100)-1] * 100
  // [(-9/10)] * 100 => -90%
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

  /** Final Response */
  const finalResponse: RequiredDataResponse = {
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
  };
  return finalResponse;
};

export default useGetKPIMetrices;
