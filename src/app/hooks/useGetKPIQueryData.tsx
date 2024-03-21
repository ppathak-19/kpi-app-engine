import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import type { CategoryType, QueryProps } from "types";
import { buildAppMainQuery } from "../utils/appQueries";

/** This Hook Returns the `QueryResult of the provided timeframe` */
const useGetKPIQueryData = (
  props: QueryProps
): {
  categoryTypes: CategoryType;
  queryResponseWithTimeLine1: QueryResult | undefined;
  queryResponseWithTimeLine2: QueryResult | undefined;
  isLoading: boolean;
  refetch: (...args) => Promise<QueryResult | undefined>;
} => {
  const { timeLine1, timeLine2 } = props;

  const getAllEventCategoryTypes = (
    data1: QueryResult | undefined,
    data2: QueryResult | undefined
  ) => {
    const categoriesData1 = new Set(
      data1?.records.map((recordData) => recordData?.["event.category"])
    );

    const categoriesData2 = new Set(
      data2?.records.map((recordData) => recordData?.["event.category"])
    );

    // Find the intersection of categories from both data sets
    const commonCategories = [...categoriesData1].filter((category) =>
      categoriesData2.has(category)
    );

    const categoryOptions = commonCategories.map((category) => ({
      value: category,
      label: category,
    }));

    return categoryOptions;
  };

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

  const categoryTypes = getAllEventCategoryTypes(
    queryData1.data,
    queryData2.data
  );

  const response = {
    categoryTypes,
    queryResponseWithTimeLine1: queryData1.data as QueryResult | undefined,
    queryResponseWithTimeLine2: queryData2.data as QueryResult | undefined,
    isLoading: queryData1.isLoading || queryData2.isLoading,
    refetch: queryData1.refetch && queryData2.refetch,
  };

  return response;
};

export default useGetKPIQueryData;
