export type InitialAppStateType = {
  baseline: {
    mttd: number;
    mttr: number;
  };
  salary: number;
};

export const initialAppStateValues: InitialAppStateType = {
  baseline: {
    mttd: 0,
    mttr: 0,
  },
  salary: 0,
};
