import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getListofKeysUsedInApp,
  getPersistedAppState,
  setAppStatePersisted,
} from "src/app/utils/appState";
import { APP_STATE_KEY_METRICS, APP_STATE_KEY_SALARIES } from "./AppStateKeys";
import {
  type InitialAppErrorType,
  type InitialAppStateType,
  initialAppErrorValues,
  initialAppStateValues,
  type ReportingBehaviorTypes,
} from "./InitialAppStates";

type ProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  state: InitialAppStateType;
  error: InitialAppErrorType;
  reportingProblemsData: {
    shorterTimeInMin: number;
    longerTimeInMin: number;
  };
  reportingBehavior: ReportingBehaviorTypes;
  setReportingBehavior;
  setAppStateValues: (val: InitialAppStateType) => void;
  setReportingProblemsData: (vaL: {
    shorterTimeInMin: number;
    longerTimeInMin: number;
  }) => void;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: ProviderProps) => {
  const [state, setAppContextValues] = useState<InitialAppStateType>(
    initialAppStateValues
  );
  const [appError, setAppError] = useState<InitialAppErrorType>(
    initialAppErrorValues
  );

  const [reportingBehavior, setReportingBehavior] =
    useState<ReportingBehaviorTypes>({
      shorterThanVal: 5,
      shorterThanDuration: "min",

      longerThanVal: 30,
      longerThanDuration: "day",
    });

  const [reportingProblemsData, setReportingProblemsData] = useState({
    shorterTimeInMin: 5,
    longerTimeInMin: 43200, // 30 Days,
  });

  const setAppStateValues = useCallback((val: InitialAppStateType) => {
    setAppContextValues(val);
    setAppStatePersisted({
      key: APP_STATE_KEY_METRICS,
      value: JSON.stringify({
        mttd: val.baseline.mttd,
        mttr: val.baseline.mttr,
      }),
    });
    setAppStatePersisted({
      key: APP_STATE_KEY_SALARIES,
      value: JSON.stringify({
        salaryValue: val.salary,
      }),
    });
  }, []);

  const contextValues: ContextType = useMemo(
    () => ({
      state,
      setAppStateValues,
      error: appError,
      reportingProblemsData,
      reportingBehavior,
      setReportingBehavior,
      setReportingProblemsData,
    }),
    [
      setAppStateValues,
      state,
      appError,
      reportingProblemsData,
      reportingBehavior,
      setReportingBehavior,
      setReportingProblemsData,
    ]
  );

  useEffect(() => {
    const appKeys = getListofKeysUsedInApp();

    const getValues = async () => {
      console.log((await appKeys).map((aa) => aa.key));
      if ((await appKeys).length > 0) {
        console.log("app key is there");
        const baselineResponse = await getPersistedAppState(
          APP_STATE_KEY_METRICS
        );

        const salary = await getPersistedAppState(APP_STATE_KEY_SALARIES);
        // console.log({ salary });

        return { baselineResponse, salary };
      } else {
        console.log(
          "key is not there, hence setting appState with initial values"
        );
        setAppStateValues(initialAppStateValues);
      }
    };

    getValues()
      .then((res) => {
        const data: InitialAppStateType = {
          baseline: {
            mttd: res?.baselineResponse.mttd,
            mttr: res?.baselineResponse.mttr,
          },
          salary: res?.salary.salaryValue,
        };
        setAppContextValues(data);
        // console.log({ data, state });
      })
      .catch((e) => {
        console.log(e.message, e.code, e.details);
        setAppError({
          isError: true,
          errorDetails: {
            code: 401,
            message: e.message,
          },
        });
      });
  }, [setAppStateValues, state.baseline.mttd, state.baseline.mttr]);

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useContext must be used within provider");
  }

  return context;
}
