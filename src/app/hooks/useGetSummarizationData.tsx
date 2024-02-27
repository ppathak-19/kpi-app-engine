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
import useGetAppState from "./useGetAppState";

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

  const { data } = useGetAppState({ key: "data" });
  console.log({ data });

  const response = {
    /** MTTD Data */
    [maxMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttdsummarizedData.data?.records[0]?.[`${maxMTTD}`] as number
      ),
    [minMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttdsummarizedData.data?.records[0]?.[`${minMTTD}`] as number
      ),
    [medianMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttdsummarizedData.data?.records[0]?.[`${medianMTTD}`] as number
      ),
    [averageMTTD]:
      !!mttdsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttdsummarizedData.data?.records[0]?.[`${averageMTTD}`] as number
      ),

    /** MTTR Data */
    [maxMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttrsummarizedData.data?.records[0]?.[`${maxMTTR}`] as number
      ),
    [minMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttrsummarizedData.data?.records[0]?.[`${minMTTR}`] as number
      ),
    [medianMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttrsummarizedData.data?.records[0]?.[`${medianMTTR}`] as number
      ),
    [averageMTTR]:
      !!mttrsummarizedData &&
      convertKpiQueryMin_to_Time(
        mttrsummarizedData.data?.records[0]?.[`${averageMTTR}`] as number
      ),

    /** Loading Indicator */
    isLoading: mttdsummarizedData.isLoading && mttrsummarizedData.isLoading,

    /** Error Indicator */
    isError: mttdsummarizedData.errorDetails && mttrsummarizedData.errorDetails,

    /** MTTR Data & MTTD in minutes -> directly returning the number */
    minMTTDInMin: Math.floor(
      mttdsummarizedData.data?.records[0]?.[`${minMTTD}`] as number
    ),
    maxMTTDInMin: Math.floor(
      mttdsummarizedData.data?.records[0]?.[`${maxMTTD}`] as number
    ),
    averageMTTDInMin: Math.floor(
      mttdsummarizedData.data?.records[0]?.[`${averageMTTD}`] as number
    ),
    medianMTTDInMin: Math.floor(
      mttdsummarizedData.data?.records[0]?.[`${medianMTTD}`] as number
    ),

    minMTTRInMin: Math.floor(
      mttrsummarizedData.data?.records[0]?.[`${minMTTR}`] as number
    ),
    maxMTTRInMin: Math.floor(
      mttrsummarizedData.data?.records[0]?.[`${maxMTTR}`] as number
    ),
    averageMTTRInMin: Math.floor(
      mttrsummarizedData.data?.records[0]?.[`${averageMTTR}`] as number
    ),
    medianMTTRInMin: Math.floor(
      mttrsummarizedData.data?.records[0]?.[`${medianMTTR}`] as number
    ),
  };

  return response;
};

export default useGetSummarizationData;
