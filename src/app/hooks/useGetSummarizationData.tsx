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

/** This Query Returns the Following Metrices -> Average, Maximum, Minimum, Median */
const useGetSummarizationData = (mttdData: number[], mttrData: number[]) => {
  /** Calculating the MTTD Metrices */
  const mttdsummarizedData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttdData}))
      | fieldsAdd ${averageMTTD} = arrayAvg(a), ${maxMTTD} = arrayMax(a), ${minMTTD} = arrayMin(a), ${medianMTTD} = arrayMedian(a)
            `,
    },
  });

  /** Calculating the MTTR Metrices */
  const mttrsummarizedData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttrData}))
      | fieldsAdd ${averageMTTR} = arrayAvg(a), ${maxMTTR} = arrayMax(a), ${minMTTR} = arrayMin(a), ${medianMTTR} = arrayMedian(a)
            `,
    },
  });

  // console.log({ mttdsummarizedData, mttrsummarizedData });

  const response = {
    /** MTTD Data */
    [maxMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttdsummarizedData.data?.records[0]?.[`${maxMTTD}`] as number) || 0
      ),
    [minMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttdsummarizedData.data?.records[0]?.[`${minMTTD}`] as number) || 0
      ),
    [medianMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttdsummarizedData.data?.records[0]?.[`${medianMTTD}`] as number) || 0
      ),
    [averageMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttdsummarizedData.data?.records[0]?.[`${averageMTTD}`] as number) || 0
      ),

    /** MTTR Data */
    [maxMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttrsummarizedData.data?.records[0]?.[`${maxMTTR}`] as number) || 0
      ),
    [minMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttrsummarizedData.data?.records[0]?.[`${minMTTR}`] as number) || 0
      ),
    [medianMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttrsummarizedData.data?.records[0]?.[`${medianMTTR}`] as number) || 0
      ),
    [averageMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        (mttrsummarizedData.data?.records[0]?.[`${averageMTTR}`] as number) || 0
      ),

    /** Loading Indicator */
    isLoading: mttdsummarizedData.isLoading && mttrsummarizedData.isLoading,

    /** Error Indicator */
    isError: mttdsummarizedData.errorDetails && mttrsummarizedData.errorDetails,

    /** MTTR Data & MTTD in minutes -> directly returning the number */
    minMTTDInNum: Math.floor(
      (mttdsummarizedData.data?.records[0]?.[`${minMTTD}`] as number) || 0
    ),
    maxMTTDInNum: Math.floor(
      (mttdsummarizedData.data?.records[0]?.[`${maxMTTD}`] as number) || 0
    ),
    averageMTTDInNum: Math.floor(
      (mttdsummarizedData.data?.records[0]?.[`${averageMTTD}`] as number) || 0
    ),
    medianMTTDInNum: Math.floor(
      (mttdsummarizedData.data?.records[0]?.[`${medianMTTD}`] as number) || 0
    ),

    minMTTRInNum: Math.floor(
      (mttrsummarizedData.data?.records[0]?.[`${minMTTR}`] as number) || 0
    ),
    maxMTTRInNum: Math.floor(
      (mttrsummarizedData.data?.records[0]?.[`${maxMTTR}`] as number) || 0
    ),
    averageMTTRInNum: Math.floor(
      (mttrsummarizedData.data?.records[0]?.[`${averageMTTR}`] as number) || 0
    ),
    medianMTTRInNum: Math.floor(
      (mttrsummarizedData.data?.records[0]?.[`${medianMTTR}`] as number) || 0
    ),
  };

  return response;
};

export default useGetSummarizationData;
