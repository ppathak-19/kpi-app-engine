import type { QueryResult } from "@dynatrace-sdk/client-query";

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppCompProps = {};

/** Application Routing Type */
export type appRoutesType = {
  path: string;
  element: React.JSX.Element;
  label: string;
};

export type OtherType = {
  isLoading?: boolean;
  isError?: boolean;
};

export type KPIaggregationTypes =
  | "minMTTD"
  | "maxMTTD"
  | "medianMTTD"
  | "averageMTTD"
  | "minMTTR"
  | "maxMTTR"
  | "medianMTTR"
  | "averageMTTR";

export type ResponseWithPercentages = Record<KPIaggregationTypes, number>;

export type ResponseWithMetricesData = Record<KPIaggregationTypes, string>;

export type CategoryType = (ResultRecordValue | undefined)[];

export type RequiredDataResponse = {
  responseInPercentageWithBaseline: ResponseWithPercentages;
  responseInPercentageWithPreviousDay: ResponseWithPercentages;
  responseWithCurrentDayData: ResponseWithMetricesData;
  responseWithPreviousDayData: ResponseWithMetricesData;
  timeSeriesWithCurrentDayData: QueryResult;
  timeSeriesWithPreviousDayData: QueryResult;
  refetch: {
    refetchMainQuery: (...args) => Promise<QueryResult | undefined>;
    refetchSummarizationQuery1: (...args) => Promise<QueryResult | undefined>;
    refetchSummarizationQuery2: (...args) => Promise<QueryResult | undefined>;
  };
  categoryTypes: CategoryType;
} & OtherType;

/** Query Props */
export type QueryProps = {
  timeLine1: "now()-7d" | "now()-2d" | "now()-30d" | string;
  timeLine2: "now()-7d" | "now()-2d" | "now()-30d" | string;
  selectedEventCategory?: [] | string[];
};

/** Metric details */
export type MetricDetailsCardSection = {
  currentDayValue: string;
  baselinePercentage: string;
  previousDayValue: string;
  comparisonWithPreviousDay: string;
};

/** Different types of aggregations in app */
export type aggregationsType = "average" | "min" | "max";

// export type aggregatorOptionsType = Record<aggregationsType, {value:string,label:string}>

/** KPI's  in app */
export type BaseLineTypes = {
  mttd: number;
  mttr: number;
};

/** ignore cases in app  */
export type IgnoreCasesType = {
  shorterTime: number;
  longerTime: number;
};

/** Duration in app */
export type DurationTypes = "min" | "hrs" | "day";
