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
import { giveMeaningFullErrorDetails } from "src/app/utils/helpers";
import type { BaseLineTypes } from "types";
import {
  APP_STATE_KEY_IGNORE_CASES,
  APP_STATE_KEY_METRICS,
  APP_STATE_KEY_SALARIES,
} from "./AppStateKeys";
import {
  initialAppErrorValues,
  initialAppStateValues,
  type IgnoreCasesObjectType,
  type InitialAppErrorType,
  type InitialAppStateType,
  type SalaryType,
} from "./InitialAppStates";

type ProviderProps = {
  children: React.ReactNode;
};

type ContextType = {
  state: InitialAppStateType;
  error: InitialAppErrorType;
  setAppStateValues: (val: InitialAppStateType) => void;
  setAppError: React.Dispatch<React.SetStateAction<InitialAppErrorType>>;
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
    // console.log(val);
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
        salaryValue: val.salary.salaryValue,
        defaultPeopleWorkingOnAProblem:
          val.salary.defaultPeopleWorkingOnAProblem,
      }),
    });
    setAppStatePersisted({
      key: APP_STATE_KEY_IGNORE_CASES,
      value: JSON.stringify({
        valuesInMinutes: {
          shorterTime: val.ignoreCases.valuesInMinutes.shorterTime,
          longerTime: val.ignoreCases.valuesInMinutes.longerTime,
        },
        reportingBehaviourDropDown: {
          shorterThanVal:
            val.ignoreCases.reportingBehaviourDropDown.shorterThanVal,
          shorterThanDuration:
            val.ignoreCases.reportingBehaviourDropDown.shorterThanDuration,

          longerThanVal:
            val.ignoreCases.reportingBehaviourDropDown.longerThanVal,
          longerThanDuration:
            val.ignoreCases.reportingBehaviourDropDown.longerThanDuration,
        },
      }),
    });
  }, []);

  const contextValues: ContextType = useMemo(
    () => ({
      state,
      setAppStateValues,
      error: appError,
      setAppError,
    }),
    [setAppStateValues, state, appError, setAppError]
  );

  useEffect(() => {
    const appKeys = getListofKeysUsedInApp();

    const getValues = async () => {
      const listOfAvailableKeys = await (
        await appKeys
      ).map((eachKey) => eachKey.key);
      // console.log({ listOfAvailableKeys });

      //here we are checking,if required keys are present or not
      if (
        listOfAvailableKeys.includes(APP_STATE_KEY_METRICS) &&
        listOfAvailableKeys.includes(APP_STATE_KEY_SALARIES) &&
        listOfAvailableKeys.includes(APP_STATE_KEY_IGNORE_CASES)
      ) {
        console.log("required app keys are there");
        const baselineResponse: BaseLineTypes = await getPersistedAppState(
          APP_STATE_KEY_METRICS
        );

        const salary: SalaryType = await getPersistedAppState(
          APP_STATE_KEY_SALARIES
        );

        const ignoreCases: IgnoreCasesObjectType = await getPersistedAppState(
          APP_STATE_KEY_IGNORE_CASES
        );

        return { baselineResponse, salary, ignoreCases };
      } else {
        console.log(
          "key is not there, hence setting appState with initial values"
        );
        setAppStateValues(initialAppStateValues);
      }
    };

    getValues()
      .then((res) => {
        // console.log({ res });
        const data: InitialAppStateType = {
          baseline: {
            mttd: res?.baselineResponse.mttd || 0,
            mttr: res?.baselineResponse.mttr || 0,
          },
          salary: {
            salaryValue: res?.salary.salaryValue || 0,
            defaultPeopleWorkingOnAProblem:
              res?.salary.defaultPeopleWorkingOnAProblem || 0,
          },
          ignoreCases: {
            valuesInMinutes: {
              longerTime: res?.ignoreCases?.valuesInMinutes?.longerTime || 0,
              shorterTime: res?.ignoreCases?.valuesInMinutes?.shorterTime || 0,
            },
            reportingBehaviourDropDown: {
              shorterThanVal:
                res?.ignoreCases?.reportingBehaviourDropDown?.shorterThanVal ||
                0,
              shorterThanDuration:
                res?.ignoreCases?.reportingBehaviourDropDown
                  ?.shorterThanDuration || "min",

              longerThanVal:
                res?.ignoreCases?.reportingBehaviourDropDown?.longerThanVal ||
                0,
              longerThanDuration:
                res?.ignoreCases?.reportingBehaviourDropDown
                  ?.longerThanDuration || "day",
            },
          },
        };
        setAppContextValues(data);
        // console.log({ data, state });
      })
      .catch((e) => {
        setAppError({
          isError: true,
          errorDetails: giveMeaningFullErrorDetails(e.message || ""),
        });
      });
  }, [
    setAppStateValues,
    state.baseline.mttd,
    state.baseline.mttr,
    state.ignoreCases.valuesInMinutes.longerTime,
    state.ignoreCases.valuesInMinutes.shorterTime,
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
