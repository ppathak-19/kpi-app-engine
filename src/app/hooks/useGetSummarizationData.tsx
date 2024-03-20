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

  /** Calculating the MTTD Metrices */
  // const mttdsummarizedData = useDqlQuery({
  //   body: {
  //     query: `
  //     data record(a = array(${mttdArrayList}))
  //     | fieldsAdd ${averageMTTD} = arrayAvg(a), ${maxMTTD} = arrayMax(a), ${minMTTD} = arrayMin(a), ${medianMTTD} = arrayMedian(a)
  //           `,
  //   },
  // });

  /** Calculating the MTTR Metrices */
  // const mttrsummarizedData = useDqlQuery({
  //   body: {
  //     query: `
  //     data record(a = array(${mttrArrayList}))
  //     | fieldsAdd ${averageMTTR} = arrayAvg(a), ${maxMTTR} = arrayMax(a), ${minMTTR} = arrayMin(a), ${medianMTTR} = arrayMedian(a)
  //           `,
  //   },
  // });

  /** returns a array of data. 0 index -> MTTD Metrices, 1st index -> MTTR Metrices */
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

  // console.log({ mttdsummarizedData, mttrsummarizedData });

  // const timeSeriesCalsMttd = useDqlQuery({
  //   body: {
  //     query: `
  //     data json:"""${JSON.stringify(queryData)}"""
  //     | fieldsAdd  timestamp =  toTimestamp(timestamp)
  //     | makeTimeseries { max(mttdTime), min(mttdTime), avg(mttdTime) }, ${
  //       shouldUseTimeFrame === true
  //         ? `timeframe: toTimeframe("${timeLine}")`
  //         : `from:${timeLine}`
  //     }
  //     `,
  //   },
  // });

  // const timeSeriesCalsMttr = useDqlQuery({
  //   body: {
  //     query: `
  //     data json:"""${JSON.stringify(queryData)}"""
  //     | fieldsAdd  timestamp =  toTimestamp(timestamp)
  //     | makeTimeseries { max(mttrTime), min(mttrTime), avg(mttrTime) }, ${
  //       shouldUseTimeFrame === true
  //         ? `timeframe: toTimeframe("${timeLine}")`
  //         : `from:${timeLine}`
  //     }
  //     `,
  //   },
  // });

  const timeSeriesCals = useDqlQuery({
    body: {
      query: `
      data json:"""${JSON.stringify(queryData)}"""
      | fieldsAdd  timestamp =  toTimestamp(timestamp)
      | makeTimeseries { ${maxMTTD} = max(mttdTime), ${minMTTD} = min(mttdTime), ${averageMTTD} = avg(mttdTime), ${maxMTTR} = max(mttrTime), ${minMTTR} = min(mttrTime), ${averageMTTR} = avg(mttrTime) }, ${`timeframe: toTimeframe("${timeLine}")`}
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
