export type InitialAppStateType = {
  baseline: {
    mttd: number;
    mttr: number;
  };
  salary: number;
  // reportingBehaviors: {
  //   shorterValueInMin: number;
  //   longerValueInMin: number;
  // };
};

export type InitialAppErrorType = {
  isError: boolean;
  errorDetails: {
    code: number;
    message: string;
  };
};

export type ReportingBehaviorTypes = {
  shorterThanVal: number;
  shorterThanDuration: string;
  longerThanVal: number;
  longerThanDuration: string;
};

export const initialAppStateValues: InitialAppStateType = {
  baseline: {
    mttd: 0,
    mttr: 0,
  },
  salary: 0,
  // reportingBehaviors: {
  //   shorterValueInMin: 5,
  //   longerValueInMin: 0,
  // },
};

export const initialAppErrorValues: InitialAppErrorType = {
  isError: false,
  errorDetails: {
    code: 0,
    message: "",
  },
};
