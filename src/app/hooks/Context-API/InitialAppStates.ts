export type InitialAppStateType = {
  baseline: {
    mttd: number;
    mttr: number;
  };
  salary: number;
};

export type InitialAppErrorType = {
  isError: boolean;
  errorDetails: {
    code: number;
    message: string;
  };
};

export const initialAppStateValues: InitialAppStateType = {
  baseline: {
    mttd: 0,
    mttr: 0,
  },
  salary: 0,
};

export const initialAppErrorValues: InitialAppErrorType = {
  isError: false,
  errorDetails: {
    code: 0,
    message: "",
  },
};
