import { useEffect, useState } from "react";
import {
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";
import useGetKPIQueryData from "./useGetKPIQueryData";
import useGetSummarizationData from "./useGetSummarizationData";

type GetKPIMetricesProps = {
  timeline: "now()-7d" | "now()-2d" | "now()-30d" | string;
  shouldUseTimeFrame: boolean;
};

/** This Hook Gives the Required Data for Table */
const useGetKPIMetrices = (props: GetKPIMetricesProps) => {
  const queryDataResponse = useGetKPIQueryData({
    timeLine: props.timeline,
    shouldUseTimeFrame: props.shouldUseTimeFrame,
  });

  const [mttdArrayList, setMttdArrayList] = useState<number[]>([]);
  const [mttrArrayList, setMttrArrayList] = useState<number[]>([]);

  useEffect(() => {
    if (!!queryDataResponse && queryDataResponse.records) {
      const data = queryDataResponse?.records
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

      setMttdArrayList(data.map((ea) => Number(ea.mttdTime)));
      setMttrArrayList(data.map((ea) => Number(ea.mttrTime)));
    }
  }, [queryDataResponse]);

  /** After Quering the data, take all the mttr,mttd list in an array and pass to useGetSummarizationData() hook to get the required metrices */
  const metricData = useGetSummarizationData(mttdArrayList, mttrArrayList);

  return metricData;
};

export default useGetKPIMetrices;
