import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import { useLayoutEffect } from "react";
import type { QueryProps } from "types";
import { buildAppMainQuery } from "../utils/appQueries";

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
  const { timeLine1, timeLine2, shouldCancelQuery } = props;

  console.log("inside useGetQueryData hook...", shouldCancelQuery);

  /** Query With TimeLine1 -> current timeframe */
  const queryData1 = useDqlQuery({
    body: {
      query: buildAppMainQuery(timeLine1),
      maxResultRecords: 9999,
    },
  });

  /** Query With TimeLine2 -> relative timeframe */
  const queryData2 = useDqlQuery({
    body: {
      query: buildAppMainQuery(timeLine2),
      maxResultRecords: 9999,
    },
  });

  useLayoutEffect(() => {
    // console.log({ tf });
    if (shouldCancelQuery) {
      queryData1.cancel();
      queryData2.cancel();
    }
  }, [queryData1, queryData2, shouldCancelQuery]);

  console.log(`Status -- Q1${queryData1.status}`);
  console.log(`Status -- Q2${queryData2.status}`);

  console.log("near resp of useGetQueryData hook...");
  const response = {
    queryResponseWithTimeLine1: queryData1.data as QueryResult | undefined,
    queryResponseWithTimeLine2: queryData2.data as QueryResult | undefined,
    isLoading: queryData1.isLoading || queryData2.isLoading,
    isErrorInMainQuery: queryData1.isError || queryData2.isError,
    refetch: queryData1.refetch && queryData2.refetch,
  };

  console.log("near return of resp of useGetQueryData hook...");
  return response;
};

export default useGetKPIQueryData;
