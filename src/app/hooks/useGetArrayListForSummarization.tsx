import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useEffect, useState } from "react";
import {
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";

type GetArrayListForSummarizationProps = {
  data: QueryResult | undefined;
};

type arrayListType = {
  mttdTime: string | number;
  mttrTime: string | number;
}[];

const useGetArrayListForSummarization = (
  props: GetArrayListForSummarizationProps
) => {
  const { data } = props;

  const [arrayList, setArrayList] = useState<arrayListType>([]);
  const [isDataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!!data && data.records) {
      const modifiedData = data?.records
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
      setArrayList(modifiedData);
      setDataLoaded(true);
    }
  }, [data]);

  return { isDataLoaded, arrayList };
};

export default useGetArrayListForSummarization;
