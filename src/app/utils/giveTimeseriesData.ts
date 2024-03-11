import type { QueryResult, ResultRecord } from "@dynatrace-sdk/client-query";
import { convertQueryResultToTimeseries } from "@dynatrace/strato-components-preview";

/** This function will return the ResultRecord[], which we are using to differentiate kpi data from one single timeseries data */
const giveRequiredKpi = (
  records: (ResultRecord | null)[],
  kpi: "mttr" | "mttd"
): ResultRecord[] => {
  const firstObj = records[0];
  const res = {
    [`avg(${kpi}Time)`]: !!firstObj
      ? firstObj?.[`avg(${kpi}Time)`]
      : ([] as number[]),
    [`min(${kpi}Time)`]: !!firstObj
      ? firstObj?.[`min(${kpi}Time)`]
      : ([] as number[]),
    [`max(${kpi}Time)`]: !!firstObj
      ? firstObj?.[`max(${kpi}Time)`]
      : ([] as number[]),
    ["timeframe"]: !!firstObj ? firstObj?.["timeframe"] : ([] as number[]),
    ["interval"]: !!firstObj ? firstObj?.["interval"] : "",
  };

  return [res];
};

export const giveTimeseriesData = (queryResult: QueryResult) => {
  /** QueryResult for MTTR  */
  const mttrData =
    !!queryResult && queryResult
      ? ({
          metadata: !!queryResult && queryResult ? queryResult.metadata : {},
          types: !!queryResult && queryResult ? queryResult.types : [],
          records:
            !!queryResult && queryResult
              ? giveRequiredKpi(queryResult.records, "mttr")
              : [],
        } as QueryResult)
      : { metadata: {}, records: [], types: [] };

  /** QueryResult for MTTD */
  const mttdData =
    !!queryResult && queryResult
      ? ({
          metadata: !!queryResult && queryResult ? queryResult.metadata : {},
          types: !!queryResult && queryResult ? queryResult.types : [],
          records:
            !!queryResult && queryResult
              ? giveRequiredKpi(queryResult.records, "mttd")
              : [],
        } as QueryResult)
      : { metadata: {}, records: [], types: [] };

  const timeseriesMttd = convertQueryResultToTimeseries(mttdData);
  const timeseriesMttr = convertQueryResultToTimeseries(mttrData);

  return { timeseriesMttd, timeseriesMttr };
};
