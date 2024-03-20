import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import type { QueryProps } from "types";
import { buildAppMainQuery } from "../utils/appQueries";

/** This Hook Returns the `QueryResult of the provided timeframe` */
const useGetKPIQueryData = (
  props: QueryProps
): {
  queryResponseWithTimeLine1: QueryResult | undefined;
  queryResponseWithTimeLine2: QueryResult | undefined;
  isLoading: boolean;
  refetch: (...args) => Promise<QueryResult | undefined>;
} => {
  const { timeLine1, timeLine2 } = props;

  const queryData1 = useDqlQuery({
    body: {
      query: buildAppMainQuery(timeLine1),
    },
  });

  const queryData2 = useDqlQuery({
    body: {
      query: buildAppMainQuery(timeLine2),
    },
  });

  const response = {
    queryResponseWithTimeLine1: queryData1.data,
    queryResponseWithTimeLine2: queryData2.data,
    isLoading: queryData1.isLoading || queryData2.isLoading,
    refetch: queryData1.refetch && queryData2.refetch,
  };

  return response;
};

export default useGetKPIQueryData;
