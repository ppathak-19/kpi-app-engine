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

export type RequiredDataResponse = {
  maxMTTD: string;
  minMTTD: string;
  medianMTTD: string;
  averageMTTD: string;
  maxMTTR: string;
  minMTTR: string;
  medianMTTR: string;
  averageMTTR: string;
  isLoading: boolean;
  isError: ErrorResponse | undefined;
  minMTTDInMin: number;
  maxMTTDInMin: number;
  averageMTTDInMin: number;
  medianMTTDInMin: number;
  minMTTRInMin: number;
  maxMTTRInMin: number;
  averageMTTRInMin: number;
  medianMTTRInMin: number;
};
