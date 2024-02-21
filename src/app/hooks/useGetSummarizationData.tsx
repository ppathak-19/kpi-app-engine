import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const useGetSummarizationData = (data: number[]) => {
  /** This Query Returns the Following Metrices -> Average, Maximum, Minimum, Median */
  const summarizedData = useDqlQuery({
    body: {
      query: `
      data record(a = array(${data}))
      | fieldsAdd average = arrayAvg(a), max = arrayMax(a), min = arrayMin(a), median = arrayMedian(a)
            `,
    },
  });

  return summarizedData;
};

export default useGetSummarizationData;
