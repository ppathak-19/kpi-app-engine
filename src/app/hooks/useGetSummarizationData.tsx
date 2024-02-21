import { useDqlQuery } from "@dynatrace-sdk/react-hooks";

const useGetSummarizationData = (data: number[]) => {
  console.log(data);
  const summarizedData = useDqlQuery({
    body: {
      query: `
                  expand ${data}
                 | summarize sum = sum(${data})
            `,
    },
  });

  console.log(summarizedData.data?.records);

  return summarizedData.data;
};

export default useGetSummarizationData;
