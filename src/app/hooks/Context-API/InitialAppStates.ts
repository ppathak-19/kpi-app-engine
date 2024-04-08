import type { BaseLineTypes, DurationTypes, IgnoreCasesType } from "types";

export type ReportingBehaviorFilterTypes = {
  shorterThanVal: number;
  shorterThanDuration: DurationTypes;
  longerThanVal: number;
  longerThanDuration: DurationTypes;
};

export type IgnoreCasesObjectType = {
  valuesInMinutes: IgnoreCasesType;
  reportingBehaviourDropDown: ReportingBehaviorFilterTypes;
};

export type SalaryType = {
  salaryValue: number;
};

export type InitialAppStateType = {
  baseline: BaseLineTypes;
  salary: SalaryType;
  ignoreCases: IgnoreCasesObjectType;
};

export type InitialAppErrorType = {
  isError: boolean;
  errorDetails: {
    code: number;
    message: string;
  };
};

/** Initial Values For the App */
export const initialBaselineValues: BaseLineTypes = {
  mttd: 0,
  mttr: 0,
};

export const initialSalaryValues: SalaryType = {
  salaryValue: 0,
};

export const initialIgnoreCasesValuesInMinutes: IgnoreCasesType = {
  shorterTime: 5, // 5 mins
  longerTime: 43200, // 30 Days
};

export const initialReportingDropDownInitialValues: ReportingBehaviorFilterTypes =
  {
    shorterThanVal: 5,
    shorterThanDuration: "min",

    longerThanVal: 30,
    longerThanDuration: "day",
  };

export const initialAppStateValues: InitialAppStateType = {
  baseline: initialBaselineValues,
  salary: initialSalaryValues,
  ignoreCases: {
    valuesInMinutes: initialIgnoreCasesValuesInMinutes,
    reportingBehaviourDropDown: initialReportingDropDownInitialValues,
  },
};

export const initialAppErrorValues: InitialAppErrorType = {
  isError: false,
  errorDetails: {
    code: 0,
    message: "",
  },
};
