import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import type { CategoryType, QueryProps } from "types";

/** This Hook Returns the `QueryResult of the provided timeline / timeframe` */
const useGetKPIQueryData = (
  props: QueryProps
): {
  categoryTypes: CategoryType;
  queryResponseWithTimeLine1: QueryResult | undefined;
  queryResponseWithTimeLine2: QueryResult | undefined;
  isLoading: boolean;
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
      query: `// fetching events in given timeline/timeframe
      fetch events, ${`timeframe:"${timeLine1}"`}
      | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
      | sort  timestamp desc
      | expand dt.davis.event_ids // expanding the array of davis events
      | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp, event.category
      | fieldsAdd res = lookup([
        fetch events, ${`timeframe:"${timeLine1}"`}
          | filter event.kind == "DAVIS_EVENT"
          |  sort timestamp asc
          | fields event.id, event.kind, event.start]
      , sourceField: dt.davis.event_ids, lookupField: event.id)
      | fieldsFlatten res // flattening the response of lookup
      | sort  res.event.start asc // sorting the response with ascending order
      | dedup  event.id // removing the duplicates of event id's
      | filter res != "null" // removing records having res == null
      `,
    },
  });

  const queryData2 = useDqlQuery({
    body: {
      query: `// fetching events in given timeline/timeframe
      fetch events, ${`timeframe:"${timeLine2}"`}
      | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
      | sort  timestamp desc
      | expand dt.davis.event_ids // expanding the array of davis events
      | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp, event.category
      | fieldsAdd res = lookup([
        fetch events, ${`timeframe:"${timeLine2}"`}
          | filter event.kind == "DAVIS_EVENT"
          |  sort timestamp asc
          | fields event.id, event.kind, event.start]
      , sourceField: dt.davis.event_ids, lookupField: event.id)
      | fieldsFlatten res // flattening the response of lookup
      | sort  res.event.start asc // sorting the response with ascending order
      | dedup  event.id // removing the duplicates of event id's
      | filter res != "null" // removing records having res == null
      `,
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
  };

  return response;
};

export default useGetKPIQueryData;
