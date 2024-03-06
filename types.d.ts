import {
  type EntityStub,
  type EvidenceEvidenceType,
} from "@dynatrace-sdk/client-classic-environment-v2";

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
  isError?: ErrorResponse | undefined;
};

export type InitialDataResponseInStrings = {
  maxMTTD: string;
  minMTTD: string;
  medianMTTD: string;
  averageMTTD: string;
  maxMTTR: string;
  minMTTR: string;
  medianMTTR: string;
  averageMTTR: string;
};

export type InitialDataResponseInNumbers = {
  minMTTDInNum: number;
  maxMTTDInNum: number;
  averageMTTDInNum: number;
  medianMTTDInNum: number;
  minMTTRInNum: number;
  maxMTTRInNum: number;
  averageMTTRInNum: number;
  medianMTTRInNum: number;
};

export type ResponseTypeInPercentage = {
  minMTTD: number;
  maxMTTD: number;
  averageMTTD: number;
  medianMTTD: number;
  minMTTR: number;
  maxMTTR: number;
  averageMTTR: number;
  medianMTTR: number;
};

export type RequiredDataResponse = InitialDataResponseInStrings &
  InitialDataResponseInNumbers &
  OtherType & {
    responseInPercentageWithPreviousDay: ResponseTypeInPercentage;
    responseInPercentageWithBaseline: ResponseTypeInPercentage;
  };

/** Query Props */
export type QueryProps = {
  timeLine1: "now()-7d" | "now()-2d" | "now()-30d" | string;
  shouldUseTimeFrame1: boolean;
  timeLine2: "now()-7d" | "now()-2d" | "now()-30d" | string;
  shouldUseTimeFrame2: boolean;
};

/** Metric details */
export type MetricDetailsCardSection = {
  currentDayValue: string;
  baselinePercentage: string;
  previousDayValue: string;
  comparisonWithPreviousDay: string;
};
