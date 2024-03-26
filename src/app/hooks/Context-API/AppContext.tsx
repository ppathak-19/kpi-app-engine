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
  initialAppErrorValues,
  initialAppStateValues,
  type InitialAppErrorType,
  type InitialAppStateType,
} from "./InitialAppStates";

type ProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  state: InitialAppStateType;
  error: InitialAppErrorType;
  setAppStateValues: (val: InitialAppStateType) => void;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: ProviderProps) => {
  const [state, setAppContextValues] = useState<InitialAppStateType>(
    initialAppStateValues
  );
  const [appError, setAppError] = useState<InitialAppErrorType>(
    initialAppErrorValues
  );

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
    }),
    [setAppStateValues, state, appError]
  );

  useEffect(() => {
    const appKeys = getListofKeysUsedInApp();

    const getValues = async () => {
      // console.log((await appKeys).map((aa) => aa.key));
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
          // as ignore cases are not stored in appPersistState, we are taking values from `state`
          ignoreCases: {
            longerTime: state.ignoreCases.longerTime,
            shorterTime: state.ignoreCases.shorterTime,
          },
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
  }, [
    setAppStateValues,
    state.baseline.mttd,
    state.baseline.mttr,
    state.ignoreCases.longerTime,
    state.ignoreCases.shorterTime,
  ]);

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
