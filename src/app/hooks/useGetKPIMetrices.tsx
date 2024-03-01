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
import {
  calculateImprovementWithPreviousdata,
  calculatePercentage,
} from "../utils/calculations";
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

  /** State For Current Days */
  const [mttdArrayListForCurrentDays, setMttdArrayListForCurrentDays] =
    useState<number[]>([]);
  const [mttrArrayListForCurrentDays, setMttrArrayListForCurrentDays] =
    useState<number[]>([]);

  /** State For Previous Days -> like if current day is 2, previous day is 2 days before */
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

  //* passing current days mttd,mttr values so we get avg,min,etc.. for current days data
  const metricData1 = useGetSummarizationData(
    mttdArrayListForCurrentDays,
    mttrArrayListForCurrentDays
  );

  //* passing previous days mttd,mttr values so we get avg,min,etc.. for previous days data
  const metricData2 = useGetSummarizationData(
    mttdArrayListForPreviousDays,
    mttrArrayListForPreviousDays
  );

  /** Taking baseline values from useContext  */
  const { initialMttdValue: baselineMTTD, initialMttrValue: baselineMTTR } =
    useMetricsContext();

  /** To cal % with respect to baseline -> divide metricData by baseline value from context */
  // if metricData is 5, baseline is 10 -> (5/10) * 100 => 50%
  const responseInPercentageWithBaseline = {
    minMTTD: calculatePercentage(metricData1.minMTTDInNum, baselineMTTD),
    maxMTTD: calculatePercentage(metricData1.maxMTTDInNum, baselineMTTD),
    averageMTTD: calculatePercentage(
      metricData1.averageMTTDInNum,
      baselineMTTD
    ),
    medianMTTD: calculatePercentage(metricData1.medianMTTDInNum, baselineMTTD),

    minMTTR: calculatePercentage(metricData1.minMTTRInNum, baselineMTTR),
    maxMTTR: calculatePercentage(metricData1.maxMTTRInNum, baselineMTTR),
    averageMTTR: calculatePercentage(
      metricData1.averageMTTRInNum,
      baselineMTTR
    ),
    medianMTTR: calculatePercentage(metricData1.medianMTTRInNum, baselineMTTR),
  };

  /** To cal % with respect to current days & previous day -> divide previous day by current day */
  const responseInPercentageWithPreviousDay = {
    minMTTD: calculateImprovementWithPreviousdata(
      metricData2.minMTTDInNum,
      metricData1.minMTTDInNum
    ),
    maxMTTD: calculateImprovementWithPreviousdata(
      metricData2.maxMTTDInNum,
      metricData1.maxMTTDInNum
    ),
    averageMTTD: calculateImprovementWithPreviousdata(
      metricData2.averageMTTDInNum,
      metricData1.averageMTTDInNum
    ),
    medianMTTD: calculateImprovementWithPreviousdata(
      metricData2.medianMTTDInNum,
      metricData1.medianMTTDInNum
    ),

    minMTTR: calculateImprovementWithPreviousdata(
      metricData2.minMTTRInNum,
      metricData1.minMTTRInNum
    ),
    maxMTTR: calculateImprovementWithPreviousdata(
      metricData2.maxMTTRInNum,
      metricData1.maxMTTRInNum
    ),
    averageMTTR: calculateImprovementWithPreviousdata(
      metricData2.averageMTTRInNum,
      metricData1.averageMTTRInNum
    ),
    medianMTTR: calculateImprovementWithPreviousdata(
      metricData2.medianMTTRInNum,
      metricData1.medianMTTRInNum
    ),
  };

  /** Final Response For DataTable */
  const finalResponse = {
    /** MTTD Data */
    [minMTTD]: `${metricData1.minMTTD}, ${responseInPercentageWithBaseline.minMTTD} %, ${metricData2.minMTTD}, ${responseInPercentageWithPreviousDay.minMTTD} %`,
    [maxMTTD]: `${metricData1.maxMTTD}, ${responseInPercentageWithBaseline.maxMTTD} %, ${metricData2.maxMTTD}, ${responseInPercentageWithPreviousDay.maxMTTD} %`,
    [averageMTTD]: `${metricData1.averageMTTD}, ${responseInPercentageWithBaseline.averageMTTD} %, ${metricData2.averageMTTD}, ${responseInPercentageWithPreviousDay.averageMTTD} %`,
    [medianMTTD]: `${metricData1.medianMTTD}, ${responseInPercentageWithBaseline.medianMTTD} %, ${metricData2.medianMTTD}, ${responseInPercentageWithPreviousDay.medianMTTD} %`,

    /** MTTR Data */
    [minMTTR]: `${metricData1.minMTTR}, ${responseInPercentageWithBaseline.minMTTR} %, ${metricData2.minMTTR}, ${responseInPercentageWithPreviousDay.minMTTR} %`,
    [maxMTTR]: `${metricData1.maxMTTR}, ${responseInPercentageWithBaseline.maxMTTR} %, ${metricData2.maxMTTR}, ${responseInPercentageWithPreviousDay.maxMTTR} %`,
    [averageMTTR]: `${metricData1.averageMTTR}, ${responseInPercentageWithBaseline.averageMTTR} %, ${metricData2.averageMTTR}, ${responseInPercentageWithPreviousDay.averageMTTR} %`,
    [medianMTTR]: `${metricData1.medianMTTR}, ${responseInPercentageWithBaseline.medianMTTD} %, ${metricData2.medianMTTR}, ${responseInPercentageWithPreviousDay.medianMTTR} %`,

    /** Other Info */
    isLoading: metricData1.isLoading && metricData2.isLoading,
  };
  return finalResponse;
};

export default useGetKPIMetrices;
