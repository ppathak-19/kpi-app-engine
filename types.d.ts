import {
  type EntityStub,
  type EvidenceEvidenceType,
} from "@dynatrace-sdk/client-classic-environment-v2";
import type { QueryResult } from "@dynatrace-sdk/client-query";

// eslint-disable-next-line @typescript-eslint/ban-types
export type AppCompProps = {};

export type TableDataType = {
  problemId: string;
  displayName: string;
  problemStartTime: string;
  problemEndTime: string;
  mttd: string;
  mttr: string;
};

export type EvidenceArrayType = {
  startTime: Date;
  displayName: string;
  entity: EntityStub;
  evidenceType: EvidenceEvidenceType;
  groupingEntity?: EntityStub | undefined;
  rootCauseRelevant: boolean;
};

export type ProblemEvidenceLineChartType = {
  name: string;
  unit: string;
  datapoints: {
    start: Date;
    end: Date;
    value: string;
  }[];
};

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

export type RequiredDataResponse = {
  responseInPercentageWithBaseline: ResponseWithPercentages;
  responseInPercentageWithPreviousDay: ResponseWithPercentages;
  responseWithCurrentDayData: ResponseWithMetricesData;
  responseWithPreviousDayData: ResponseWithMetricesData;
  timeSeriesWithCurrentDayData: QueryResult;
} & OtherType;

/** Query Props */
export type QueryProps = {
  timeLine1: "now()-7d" | "now()-2d" | "now()-30d" | string;
  timeLine2: "now()-7d" | "now()-2d" | "now()-30d" | string;
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
