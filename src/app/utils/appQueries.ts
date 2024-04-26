// export const buildAppMainQuery = (timeFrame: string) => `\
// // fetching events in given timeline/timeframe
//       fetch events, timeframe:"${timeFrame}"
//       | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
//       | sort  timestamp desc
//       | expand dt.davis.event_ids // expanding the array of davis events
//       | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp, event.category
//       | fieldsAdd res = lookup([
//         fetch events, timeframe:"${timeFrame}"
//           | filter event.kind == "DAVIS_EVENT"
//           |  sort timestamp asc
//           | fields event.id, event.kind, event.start]
//       , sourceField: dt.davis.event_ids, lookupField: event.id)
//       | fieldsFlatten res // flattening the response of lookup
//       | sort  res.event.start asc // sorting the response with ascending order
//       | dedup  event.id // removing the duplicates of event id's
//       | filter res != "null" // removing records having res == null
// `;

import {
  EventCategory,
  EventEnd,
  EventStart,
  InitialEventStart,
  timestamp,
} from "../constants/KpiFieldConstants";

/** Radu Query */
// export const buildAppMainQuery = (timeFrame: string) => `\
// // fetching events in given timeline/timeframe
// fetch dt.davis.problems.snapshots, timeframe: "${timeFrame}"
//   | filter (event.status_transition == "CLOSED" OR event.status_transition == "CREATED")
//   | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp,event.category
//   | expand  dt.davis.event_ids
//   | fieldsRename mykey = dt.davis.event_ids
//   | append [
//     fetch  dt.davis.events.snapshots, timeframe: "${timeFrame}"
//     | fieldsRename mykey = event.id
//     | fieldsAdd firsteventstart = event.start
//     | sort firsteventstart asc
//   ]
//   | summarize {
//     mttr = max(resolved_problem_duration),
//     event.start = takeFirst(event.start),
//     event.end = takeFirst(event.end),
//     event.category = takeAny(event.category),
//     display_id = takeAny(display_id),
//     res.event.start = takeLast(firsteventstart),
//     timestamp = takeFirst(timestamp)
//   }, by: { mykey }
//   | fieldsAdd mttd = event.start - res.event.start
//   | filter isNotNull(mttr) and isNotNull(display_id) and isNotNull(mttd)
// `;

export const buildAppMainQuery = (timeline: string) => `\
fetch dt.davis.problems.snapshots, timeframe: "${timeline}"
  | filter (event.status_transition == "CLOSED" OR event.status_transition == "CREATED")
  | fieldsKeep event.start, event.end,resolved_problem_duration,dt.davis.event_ids,event.id, display_id, timestamp,event.category
  | expand  dt.davis.event_ids
  | fieldsRename myDavisId = dt.davis.event_ids
  | filter isNotNull(event.end)
  | append [
    fetch  dt.davis.events.snapshots
    | fieldsAdd myDavisId = event.id , firsteventstart = event.start
    | sort firsteventstart asc
  ]
  | summarize {
    mttr = max(resolved_problem_duration),
    ${EventStart} = takeFirst(event.start),
    ${EventEnd} = takeFirst(event.end),
    ${EventCategory} = takeAny(event.category),
    display_id = takeAny(display_id),
    ${InitialEventStart} = takeMin(firsteventstart),
    res.event.kind = takeLast(event.kind),
    res.event.id = takeLast(event.id),
    ${timestamp} = takeFirst(timestamp),
    event.id = takeFirst(event.id)
  }, by: { myDavisId }
  | fieldsAdd mttd = event.start - res.event.start
  | filter isNotNull(mttr) and isNotNull(display_id) and isNotNull(mttd)
  | sort mttd desc
  | dedup display_id
  | limit 9999
`;
