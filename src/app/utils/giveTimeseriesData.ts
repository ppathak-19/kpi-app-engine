import type { QueryResult, ResultRecord } from "@dynatrace-sdk/client-query";
import { convertQueryResultToTimeseries } from "@dynatrace/strato-components-preview";
import type { aggregationsType } from "types";

type giveTimeseriesDataParametersType = {
  queryResult: QueryResult;
  aggregation: aggregationsType;
};

type giveRequiredKpiParametersType = {
  records: (ResultRecord | null)[];
  kpi: "MTTR" | "MTTD";
  aggregation: aggregationsType;
};

/** This function will return the ResultRecord[], which will return only aggregation provided. */
const giveRequiredKpi = ({
  aggregation,
  kpi,
  records,
}: giveRequiredKpiParametersType): ResultRecord[] => {
  const firstObj = records[0];
  const res = {
    [`${aggregation}${kpi}`]: !!firstObj
      ? firstObj?.[`${aggregation}${kpi}`]
      : ([] as number[]),
    ["timeframe"]: !!firstObj ? firstObj?.["timeframe"] : ([] as number[]),
    ["interval"]: !!firstObj ? firstObj?.["interval"] : "",
  };

  return [res];
};

export const giveTimeseriesData = ({
  aggregation,
  queryResult,
}: giveTimeseriesDataParametersType) => {
  /** QueryResult for MTTR  */
  const mttrData =
    !!queryResult && queryResult
      ? ({
          metadata: !!queryResult && queryResult ? queryResult.metadata : {},
          types: !!queryResult && queryResult ? queryResult.types : [],
          records:
            !!queryResult && queryResult
              ? giveRequiredKpi({
                  records: queryResult.records,
                  aggregation,
                  kpi: "MTTR",
                })
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
              ? giveRequiredKpi({
                  records: queryResult.records,
                  aggregation,
                  kpi: "MTTD",
                })
              : [],
        } as QueryResult)
      : { metadata: {}, records: [], types: [] };

  const timeseriesMttd = convertQueryResultToTimeseries(mttdData);
  const timeseriesMttr = convertQueryResultToTimeseries(mttrData);

  return { timeseriesMttd, timeseriesMttr };
};
