import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const useGetSummarizationData = (mttdData: number[], mttrData: number[]) => {
  /** This Query Returns the Following Metrices -> Average, Maximum, Minimum, Median */
  const mttdsummarizedData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttdData}))
      | fieldsAdd averageTTD = arrayAvg(a), maxTTD = arrayMax(a), minTTD = arrayMin(a), medianTTD = arrayMedian(a)
            `,
    },
  });

  const mttrsummarizedData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${mttrData}))
      | fieldsAdd averageTTR = arrayAvg(a), maxTTR = arrayMax(a), minTTR = arrayMin(a), medianTTR = arrayMedian(a)
            `,
    },
  });

  return { mttdsummarizedData, mttrsummarizedData };
};

export default useGetSummarizationData;
