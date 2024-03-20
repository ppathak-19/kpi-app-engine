export const buildAppMainQuery = (timeFrame: string) => `\
// fetching events in given timeline/timeframe
      fetch events, timeframe:"${timeFrame}"
      | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
      | sort  timestamp desc
      | expand dt.davis.event_ids // expanding the array of davis events
      | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp, event.category
      | fieldsAdd res = lookup([
        fetch events, timeframe:"${timeFrame}"
          | filter event.kind == "DAVIS_EVENT"
          |  sort timestamp asc
          | fields event.id, event.kind, event.start]
      , sourceField: dt.davis.event_ids, lookupField: event.id)
      | fieldsFlatten res // flattening the response of lookup
      | sort  res.event.start asc // sorting the response with ascending order
      | dedup  event.id // removing the duplicates of event id's
      | filter res != "null" // removing records having res == null
`;
