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
