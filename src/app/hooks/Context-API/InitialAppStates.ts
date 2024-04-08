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
  defaultPeopleWorkingOnAProblem: number;
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
  mttd: 45, // 45 minutes
  mttr: 240, // 4 hours
};

export const initialSalaryValues: SalaryType = {
  salaryValue: 65, // 65 Dollars per hour
  defaultPeopleWorkingOnAProblem: 3, // 3 people working on a problem
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
