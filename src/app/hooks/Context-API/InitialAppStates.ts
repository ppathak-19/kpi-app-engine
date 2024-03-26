import type { BaseLineTypes, DurationTypes, IgnoreCasesType } from "types";

export type InitialAppStateType = {
  baseline: BaseLineTypes;
  salary: number;
  ignoreCases: IgnoreCasesType;
};

export type InitialAppErrorType = {
  isError: boolean;
  errorDetails: {
    code: number;
    message: string;
  };
};

export type ReportingBehaviorFilterTypes = {
  shorterThanVal: number;
  shorterThanDuration: DurationTypes;
  longerThanVal: number;
  longerThanDuration: DurationTypes;
};

/** Initial Values For the App */

export const initialAppStateValues: InitialAppStateType = {
  baseline: {
    mttd: 0,
    mttr: 0,
  },
  salary: 0,
  ignoreCases: {
    shorterTime: 5, // 5 mins
    longerTime: 43200, // 30 Days
  },
};

export const initialAppErrorValues: InitialAppErrorType = {
  isError: false,
  errorDetails: {
    code: 0,
    message: "",
  },
};

export const reportingDropDownInitialValues: ReportingBehaviorFilterTypes = {
  shorterThanVal: 5,
  shorterThanDuration: "min",

  longerThanVal: 30,
  longerThanDuration: "day",
};
