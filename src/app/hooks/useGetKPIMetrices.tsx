import { useEffect, useState } from "react";
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
import useGetKPIQueryData from "./useGetKPIQueryData";
import useGetSummarizationData from "./useGetSummarizationData";
import type { QueryProps } from "types";
import { useMetricsContext } from "./context/MetricsContext";

/** This Hook Gives the Required Data for Table */
const useGetKPIMetrices = (props: QueryProps) => {
  const { shouldUseTimeFrame1, shouldUseTimeFrame2, timeLine1, timeLine2 } =
    props;

  const { queryResponseWithTimeLine1: q1, queryResponseWithTimeLine2: q2 } =
    useGetKPIQueryData({
      timeLine1,
      timeLine2,
      shouldUseTimeFrame1,
      shouldUseTimeFrame2,
    });

  // console.log(q1,q2);

  const [mttdArrayListForCurrentDays, setMttdArrayListForCurrentDays] =
    useState<number[]>([]);
  const [mttrArrayListForCurrentDays, setMttrArrayListForCurrentDays] =
    useState<number[]>([]);

  const [mttdArrayListForPreviousDays, setMttdArrayListForPreviousDays] =
    useState<number[]>([]);
  const [mttrArrayListForPreviousDays, setMttrArrayListForPreviousDays] =
    useState<number[]>([]);

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

      setMttdArrayListForCurrentDays(data1.map((ea) => Number(ea.mttdTime)));
      setMttrArrayListForCurrentDays(data1.map((ea) => Number(ea.mttrTime)));
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

      setMttdArrayListForPreviousDays(data2.map((ea) => Number(ea.mttdTime)));
      setMttrArrayListForPreviousDays(data2.map((ea) => Number(ea.mttrTime)));
    }
  }, [q1, q2]);

  /** After Quering the data, take all the mttr,mttd list in an array and pass to useGetSummarizationData() hook to get the required metrices */
  const metricData1 = useGetSummarizationData(
    mttdArrayListForCurrentDays,
    mttrArrayListForCurrentDays
  );

  const metricData2 = useGetSummarizationData(
    mttdArrayListForPreviousDays,
    mttrArrayListForPreviousDays
  );

  // assumption
  const { initialMttdValue: baselineMTTD, initialMttrValue: baselineMTTR } =
    useMetricsContext();

  const responseInPercentageWithBaseline = {
    minMTTD: calculatePercentage(metricData1.minMTTDInMin, baselineMTTD),
    maxMTTD: calculatePercentage(metricData1.maxMTTDInMin, baselineMTTD),
    averageMTTD: calculatePercentage(
      metricData1.averageMTTRInMin,
      baselineMTTD
    ),
    medianMTTD: calculatePercentage(metricData1.medianMTTDInMin, baselineMTTD),

    minMTTR: calculatePercentage(metricData1.minMTTRInMin, baselineMTTR),
    maxMTTR: calculatePercentage(metricData1.maxMTTRInMin, baselineMTTR),
    averageMTTR: calculatePercentage(
      metricData1.averageMTTRInMin,
      baselineMTTR
    ),
    medianMTTR: calculatePercentage(metricData1.medianMTTRInMin, baselineMTTR),
  };

  const responseInPercentageWithPreviousDay = {
    minMTTD: calculatePercentage(
      metricData1.minMTTDInMin,
      metricData2.minMTTDInMin
    ),
    maxMTTD: calculatePercentage(
      metricData1.maxMTTDInMin,
      metricData2.maxMTTDInMin
    ),
    averageMTTD: calculatePercentage(
      metricData1.averageMTTRInMin,
      metricData2.averageMTTDInMin
    ),
    medianMTTD: calculatePercentage(
      metricData1.medianMTTDInMin,
      metricData2.medianMTTDInMin
    ),

    minMTTR: calculatePercentage(
      metricData1.minMTTRInMin,
      metricData2.minMTTRInMin
    ),
    maxMTTR: calculatePercentage(
      metricData1.maxMTTRInMin,
      metricData2.maxMTTRInMin
    ),
    averageMTTR: calculatePercentage(
      metricData1.averageMTTRInMin,
      metricData2.averageMTTRInMin
    ),
    medianMTTR: calculatePercentage(
      metricData1.medianMTTRInMin,
      metricData2.medianMTTRInMin
    ),
  };

  const finalResponse = {
    /** MTTD Data */
    [minMTTD]: `${responseInPercentageWithBaseline.minMTTD} % , ${responseInPercentageWithPreviousDay.minMTTD} %`,
    [maxMTTD]: `${responseInPercentageWithBaseline.maxMTTD} % , ${responseInPercentageWithPreviousDay.maxMTTD} %`,
    [averageMTTD]: `${responseInPercentageWithBaseline.averageMTTD} % , ${responseInPercentageWithPreviousDay.averageMTTD} %`,
    [medianMTTD]: `${responseInPercentageWithBaseline.medianMTTD} % , ${responseInPercentageWithPreviousDay.medianMTTD} %`,

    /** MTTR Data */
    [minMTTR]: `${responseInPercentageWithBaseline.minMTTR} % , ${responseInPercentageWithPreviousDay.minMTTR} %`,
    [maxMTTR]: `${responseInPercentageWithBaseline.maxMTTR} % , ${responseInPercentageWithPreviousDay.maxMTTR} %`,
    [averageMTTR]: `${responseInPercentageWithBaseline.averageMTTR} % , ${responseInPercentageWithPreviousDay.averageMTTR} %`,
    [medianMTTR]: `${responseInPercentageWithBaseline.medianMTTD} % , ${responseInPercentageWithPreviousDay.medianMTTR} %`,

    /** Other Info */
    isLoading: metricData1.isLoading && metricData2.isLoading,
  };
  return finalResponse;
};

export default useGetKPIMetrices;
