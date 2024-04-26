import type { ResultRecord } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import {
  averageMTTD,
  averageMTTR,
  medianMTTD,
  medianMTTR,
  mttdTime,
  mttrTime,
  timestamp,
} from "../constants/KpiFieldConstants";
import { convertKpiQueryMin_to_Time } from "../utils/timeConverters";

type SummarizationDataHookProps = {
  queryData: ResultRecord[];
  timeLine: string;
  shouldCancelQuery: boolean;
};

/** This Query Returns the Following Metrices -> Average, Maximum, Minimum, Median */
const useGetSummarizationData = ({
  queryData,
  timeLine,
}: // tf,
// shouldCancel,
SummarizationDataHookProps) => {
  // console.log({ queryData });
  const mttdArrayList = queryData.map((each) => each.mttdTime);
  const mttrArrayList = queryData.map((each) => each.mttrTime);
  const modifiedQueryData = queryData.map((eachData) => ({
    [`${timestamp}`]: eachData?.[`${timestamp}`],
    [`${mttdTime}`]: eachData?.[`${mttdTime}`],
    [`${mttrTime}`]: eachData?.[`${mttrTime}`],
  }));

  console.log("inside useSum hook...");

  /** returns a array of data. 0 index -> MTTD Metrices, 1st index -> MTTR Metrices */
  // here we are using `append` cmd to combine two queries and return two results -> arr[0,1]
  const summarizationData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttdArrayList}))
      | fieldsAdd ${averageMTTD} = arrayAvg(a), ${medianMTTD} = arrayMedian(a)
      | append [   data record(a = array(${mttrArrayList}))
        | fieldsAdd ${averageMTTR} = arrayAvg(a), ${medianMTTR} = arrayMedian(a) ]
      `,
    },
  });

  /** passing the query records to data json and getting results as we required */
  const timeSeriesCals = useDqlQuery({
    body: {
      query: `
      data json:"""${JSON.stringify(modifiedQueryData)}"""
      | fieldsAdd  timestamp =  toTimestamp(timestamp) //converting into required timestamp
      | makeTimeseries {
        ${averageMTTD} = avg(mttdTime), ${medianMTTD} = median(mttdTime), // MTTD series
        ${averageMTTR} = avg(mttrTime), ${medianMTTR} = median(mttrTime) // MTTR series
      }, 
        timeframe: toTimeframe("${timeLine}") //converting into required timeframe
      `,
    },
  });

  console.log("near useSum response");

  const response = {
    /** MTTD Data */
    [medianMTTD]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[0]?.[`${medianMTTD}`] as number) || 0
      ),
    [averageMTTD]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[0]?.[`${averageMTTD}`] as number) || 0
      ),

    /** MTTR Data */
    [medianMTTR]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[1]?.[`${medianMTTR}`] as number) || 0
      ),
    [averageMTTR]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[1]?.[`${averageMTTR}`] as number) || 0
      ),

    /** Loading Indicator */
    isLoading: summarizationData.isLoading || timeSeriesCals.isLoading,

    /** Error Indicator */
    isError: summarizationData.isError || timeSeriesCals.isError,

    /** MTTR Data & MTTD in minutes -> directly returning the number */
    averageMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${averageMTTD}`] as number) || 0
    ),
    medianMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${medianMTTD}`] as number) || 0
    ),

    averageMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${averageMTTR}`] as number) || 0
    ),
    medianMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${medianMTTR}`] as number) || 0
    ),

    /** MakeTimeseries data */
    dataTimeseries:
      !!timeSeriesCals && timeSeriesCals.data
        ? timeSeriesCals.data
        : { metadata: {}, records: [], types: [] },

    /** Refetching */
    refetch: summarizationData.refetch && timeSeriesCals.refetch,
  };

  console.log("near return of response useSumm hook");
  return response;
};

export default useGetSummarizationData;
