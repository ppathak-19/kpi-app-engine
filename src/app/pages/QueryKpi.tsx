import { Surface, TitleBar } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps } from "types";
import useGetKPIQueryData from "../hooks/useGetKPIQueryData";
import useGetSummarizationData from "../hooks/useGetSummarizationData";
import {
  // convertKpiQueryMS_to_Time,
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";
import { ResultRecord } from "@dynatrace-sdk/client-query";

const QueryKpi: React.FC<AppCompProps> = () => {
  const dataOfLastDay = useGetKPIQueryData({ timeLine: "now()-10d" });
  // console.log(dataOfLastDay?.records);

  const [lastDayData, setLastDateData] = useState<(ResultRecord | null)[]>([]);
  const [mttdArrayList, setMttdArrayList] = useState<number[]>([]);
  const [mttrArrayList, setMttrArrayList] = useState<number[]>([]);

  useEffect(() => {
    if (!!dataOfLastDay && dataOfLastDay.records) {
      const data = dataOfLastDay?.records.map((eachR) => {
        const mttd = formatProblemTimeWithDiff(
          convertUTCToDate(eachR?.["event.start"] as string),
          convertUTCToDate(eachR?.["res.event.start"] as string)
        );

        const mttr = formatProblemTimeWithDiff(
          convertUTCToDate(eachR?.["event.start"] as string),
          convertUTCToDate(eachR?.["event.end"] as string)
        );

        return {
          ...eachR,
          mttdTime: mttd,
          mttrTime: mttr,
        };
      });
      setLastDateData(data);
      setMttdArrayList(data.map((ea) => Number(ea.mttdTime)));
      setMttrArrayList(data.map((ea) => Number(ea.mttrTime)));
    }
  }, [dataOfLastDay]);
  // console.log({ lastDayData, mttdArrayList, mttrArrayList });

  // const [resolvedDuration, setResolvedDuration] = useState<number[]>([]);

  // useEffect(() => {
  //   if (!!dataOfLastDay && dataOfLastDay.records) {
  //     const resolved_problem_duration = dataOfLastDay?.records?.map((eachR) =>
  //       Number(eachR?.resolved_problem_duration)
  //     );

  //     setResolvedDuration(resolved_problem_duration || []);
  //   }
  // }, [dataOfLastDay]);

  const metricData = useGetSummarizationData(mttdArrayList, mttrArrayList);
  console.log(metricData);

  // const getActualTimeOfData = () => {
  //   if (
  //     !!metricData &&
  //     metricData.data?.records &&
  //     metricData.data.records.length >= 0
  //   ) {
  //     const metrices = metricData?.data?.records[0];
  //     const averageMTTR = convertKpiQueryMS_to_Time(Number(metrices?.average));
  //     const maximumMTTR = convertKpiQueryMS_to_Time(Number(metrices?.max));
  //     const minimumMTTR = convertKpiQueryMS_to_Time(Number(metrices?.min));
  //     const medianMTTR = convertKpiQueryMS_to_Time(Number(metrices?.median));
  //     console.log({ maximumMTTR, medianMTTR, minimumMTTR, averageMTTR });
  //   }
  // };

  // getActualTimeOfData();

  // useEffect(() => {
  //   const data = dataOfLastDay?.records.map((eachR) => {
  //     const mttd = formatProblemTimeWithDiff(
  //       convertUTCToDate(eachR?.["event.start"] as string),
  //       convertUTCToDate(eachR?.["res.event.start"] as string)
  //     );

  //     const mttr = formatProblemTimeWithDiff(
  //       convertUTCToDate(eachR?.["event.start"] as string),
  //       convertUTCToDate(eachR?.["event.end"] as string)
  //     );

  //     return {
  //       ...eachR,
  //       mttdTime: mttd,
  //       mttrTime: mttr,
  //     };
  //   });

  //   console.log(data);
  // }, [dataOfLastDay]);

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>Query KPI</TitleBar.Title>
      </TitleBar>
    </Surface>
  );
};

export default QueryKpi;
