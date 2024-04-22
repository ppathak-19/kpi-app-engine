import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import type { QueryProps } from "types";
import { buildAppMainQuery } from "../utils/appQueries";
import { useCachedQueryData } from "./useConditionalDQLQuery";

/** This Hook Returns the `QueryResult of the provided timeframe` */
const useGetKPIQueryData = (
  props: QueryProps
): {
  queryResponseWithTimeLine1: QueryResult | undefined;
  queryResponseWithTimeLine2: QueryResult | undefined;
  isLoading: boolean;
  isErrorInMainQuery: boolean;
  refetch: (...args) => Promise<QueryResult | undefined>;
} => {
  const { timeLine1, timeLine2, selectedTimeFrame } = props;

  // console.log(autoFetchData, "auto fetch");

  /** Query With TimeLine1 -> current timeframe */
  const queryData1 = useDqlQuery(
    {
      body: {
        query: buildAppMainQuery(timeLine1),
      },
    },
    { autoFetch: false, autoFetchOnUpdate: false }
  );

  // /** Query With TimeLine2 -> relative timeframe */
  const queryData2 = useDqlQuery({
    body: {
      query: buildAppMainQuery(timeLine2),
    },
  });

  const cachedQueryData = useCachedQueryData(queryData1, selectedTimeFrame);

  console.log(cachedQueryData, "cached data");

  const response = {
    queryResponseWithTimeLine1: queryData1.data as QueryResult | undefined,
    queryResponseWithTimeLine2: queryData2.data as QueryResult | undefined,
    isLoading: queryData1.isLoading || queryData2.isLoading,
    isErrorInMainQuery: queryData1.isError || queryData2.isError,
    refetch: queryData1.refetch && queryData2.refetch,
  };

  return response;
};

export default useGetKPIQueryData;
