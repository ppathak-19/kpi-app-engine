import { type QueryResult } from "@dynatrace-sdk/client-query";
import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import type { QueryProps } from "types";

/** This Hook Returns the `QueryResult of the provided timeline / timeframe` */
const useGetKPIQueryData = (
  props: QueryProps
): {
  queryResponseWithTimeLine1: QueryResult | undefined;
  queryResponseWithTimeLine2: QueryResult | undefined;
} => {
  const { timeLine1, shouldUseTimeFrame1, timeLine2, shouldUseTimeFrame2 } =
    props;

  const queryData1 = useDqlQuery({
    body: {
      query: `// fetching events in given timeline/timeframe
      fetch events, ${
        shouldUseTimeFrame1 === true
          ? `timeframe:"${timeLine1}"`
          : `from: ${timeLine1}`
      }
      | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
      | sort  timestamp desc
      | expand dt.davis.event_ids // expanding the array of davis events
      | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id
      | fieldsAdd res = lookup([
        fetch events, ${
          shouldUseTimeFrame1 === true
            ? `timeframe:"${timeLine1}"`
            : `from: ${timeLine1}`
        }
          | filter event.kind == "DAVIS_EVENT"
          |  sort timestamp asc
          | fields event.id, event.kind, event.start]
      , sourceField: dt.davis.event_ids, lookupField: event.id)
      | fieldsFlatten res // flattening the response of lookup
      | sort  res.event.start asc // sorting the response with ascending order
      | dedup  event.id // removing the duplicates of event id's
      `,
    },
  });

  const queryData2 = useDqlQuery({
    body: {
      query: `// fetching events in given timeline/timeframe
      fetch events, ${
        shouldUseTimeFrame2 === true
          ? `timeframe:"${timeLine2}"`
          : `from: ${timeLine2}`
      }
      | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
      | sort  timestamp desc
      | expand dt.davis.event_ids // expanding the array of davis events
      | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id
      | fieldsAdd res = lookup([
        fetch events, ${
          shouldUseTimeFrame2 === true
            ? `timeframe:"${timeLine2}"`
            : `from: ${timeLine2}`
        }
          | filter event.kind == "DAVIS_EVENT"
          |  sort timestamp asc
          | fields event.id, event.kind, event.start]
      , sourceField: dt.davis.event_ids, lookupField: event.id)
      | fieldsFlatten res // flattening the response of lookup
      | sort  res.event.start asc // sorting the response with ascending order
      | dedup  event.id // removing the duplicates of event id's
      `,
    },
  });

  const response = {
    queryResponseWithTimeLine1: queryData1.data,
    queryResponseWithTimeLine2: queryData2.data,
  };

  return response;
};

export default useGetKPIQueryData;
