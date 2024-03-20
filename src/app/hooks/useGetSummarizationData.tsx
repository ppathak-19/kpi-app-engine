import type { ResultRecord } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
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
import { convertKpiQueryMin_to_Time } from "../utils/timeConverters";

type SummarizationDataHookProps = {
  queryData: ResultRecord[];
  timeLine: string;
};

/** This Query Returns the Following Metrices -> Average, Maximum, Minimum, Median */
const useGetSummarizationData = ({
  queryData,
  timeLine,
}: SummarizationDataHookProps) => {
  // console.log(queryData);
  const mttdArrayList = queryData.map((each) => each.mttdTime);
  const mttrArrayList = queryData.map((each) => each.mttrTime);

  /** returns a array of data. 0 index -> MTTD Metrices, 1st index -> MTTR Metrices */
  // here we are using `append` cmd to combine two queries and return two results -> arr[0,1]
  const summarizationData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttdArrayList}))
      | fieldsAdd ${averageMTTD} = arrayAvg(a), ${maxMTTD} = arrayMax(a), ${minMTTD} = arrayMin(a), ${medianMTTD} = arrayMedian(a)
      | append [   data record(a = array(${mttrArrayList}))
        | fieldsAdd ${averageMTTR} = arrayAvg(a), ${maxMTTR} = arrayMax(a), ${minMTTR} = arrayMin(a), ${medianMTTR} = arrayMedian(a) ]
      `,
    },
  });

  /** passing the query records to data json and getting results as we required */
  const timeSeriesCals = useDqlQuery({
    body: {
      query: `
      data json:"""${JSON.stringify(queryData)}"""
      | fieldsAdd  timestamp =  toTimestamp(timestamp) //converting into required timestamp
      | makeTimeseries {
        ${maxMTTD} = max(mttdTime), ${minMTTD} = min(mttdTime), ${averageMTTD} = avg(mttdTime), ${medianMTTD} = median(mttdTime), // MTTD series
        ${maxMTTR} = max(mttrTime), ${minMTTR} = min(mttrTime), ${averageMTTR} = avg(mttrTime), ${medianMTTR} = median(mttrTime) // MTTR series
      }, 
        timeframe: toTimeframe("${timeLine}") //converting into required timeframe
      `,
    },
  });

  const response = {
    /** MTTD Data */
    [maxMTTD]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[0]?.[`${maxMTTD}`] as number) || 0
      ),
    [minMTTD]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[0]?.[`${minMTTD}`] as number) || 0
      ),
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
    [maxMTTR]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[1]?.[`${maxMTTR}`] as number) || 0
      ),
    [minMTTR]:
      !!summarizationData &&
      convertKpiQueryMin_to_Time(
        (summarizationData.data?.records[1]?.[`${minMTTR}`] as number) || 0
      ),
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
    isLoading: summarizationData.isLoading && timeSeriesCals.isLoading,

    /** Error Indicator */
    isError: summarizationData.isError,

    /** MTTR Data & MTTD in minutes -> directly returning the number */
    minMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${minMTTD}`] as number) || 0
    ),
    maxMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${maxMTTD}`] as number) || 0
    ),
    averageMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${averageMTTD}`] as number) || 0
    ),
    medianMTTDInNum: Math.floor(
      (summarizationData.data?.records[0]?.[`${medianMTTD}`] as number) || 0
    ),

    minMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${minMTTR}`] as number) || 0
    ),
    maxMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${maxMTTR}`] as number) || 0
    ),
    averageMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${averageMTTR}`] as number) || 0
    ),
    medianMTTRInNum: Math.floor(
      (summarizationData.data?.records[1]?.[`${medianMTTR}`] as number) || 0
    ),

    /** MakeTimeseries data */
    // timeSeriesData: {
    //   mttd:
    //     !!timeSeriesCalsMttd && timeSeriesCalsMttd.data
    //       ? timeSeriesCalsMttd.data
    //       : { metadata: {}, records: [], types: [] },
    //   mttr:
    //     !!timeSeriesCalsMttr && timeSeriesCalsMttr.data
    //       ? timeSeriesCalsMttr.data
    //       : { metadata: {}, records: [], types: [] },
    // },
    dataTimeseries:
      !!timeSeriesCals && timeSeriesCals.data
        ? timeSeriesCals.data
        : { metadata: {}, records: [], types: [] },
  };

  return response;
};

export default useGetSummarizationData;
