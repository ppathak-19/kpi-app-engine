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
import { InitialAppStateType, initialAppStateValues } from "./InitialAppStates";

type ProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  state: InitialAppStateType;
  setAppContextValues: React.Dispatch<
    React.SetStateAction<InitialAppStateType>
  >;
  setAppStateValues: (val: InitialAppStateType) => void;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = ({ children }: ProviderProps) => {
  const [state, setAppContextValues] = useState<InitialAppStateType>(
    initialAppStateValues
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

  const contextValues = useMemo(
    () => ({
      state,
      setAppContextValues,
      setAppStateValues,
    }),
    [setAppStateValues, state]
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
      // try {
      //   const baselineResponse = await getPersistedAppState(
      //     APP_STATE_KEY_METRICS
      //   );
      //   return { baselineResponse };
      // } catch (e) {
      //   if (e) {
      //     console.error(e);
      //   }
      // }
    };

    getValues()
      .then((res) => {
        const data: InitialAppStateType = {
          baseline: {
            mttd: res?.baselineResponse.mttd,
            mttr: res?.baselineResponse.mttr,
            // mttd: 90,
            // mttr: 88,
          },
          salary: res?.salary.salaryValue,
        };
        setAppContextValues(data);
        // console.log({ data, state });
      })
      .catch((e) => console.log(e));
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
