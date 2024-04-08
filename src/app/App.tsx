import {
  Divider,
  Flex,
  Heading,
  Page,
  showToast,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import type { AppCompProps } from "types";
import Header from "./components/Header";
import ReportingBehaviorFilter from "./components/ReportingBehaviorFilter";
import KPIButton from "./components/ReusableComponents/KPIButton";
import KPIModal from "./components/ReusableComponents/KPIModal";
import KPINumberInput from "./components/ReusableComponents/KPINumberInput";
import { InformationModalData } from "./constants/ModalData";
import { useAppContext } from "./hooks/Context-API/AppContext";
import {
  initialAppStateValues,
  type InitialAppStateType,
} from "./hooks/Context-API/InitialAppStates";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import { convertTimeToMinutes } from "./utils/timeConverters";

const App: React.FC<AppCompProps> = () => {
  /** States For settings, info modal open and close  */
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);

  const { state, setAppStateValues } = useAppContext();

  /** State For all inputs in the settings modal */
  const [userInputValues, setUserInputValues] = useState<InitialAppStateType>(
    initialAppStateValues
  );

  useEffect(() => {
    setUserInputValues({
      baseline: {
        mttd: state.baseline.mttd,
        mttr: state.baseline.mttr,
      },
      salary: state.salary,
      ignoreCases: {
        valuesInMinutes: {
          longerTime: state.ignoreCases.valuesInMinutes.longerTime,
          shorterTime: state.ignoreCases.valuesInMinutes.shorterTime,
        },
        reportingBehaviourDropDown: {
          shorterThanVal:
            state.ignoreCases.reportingBehaviourDropDown.shorterThanVal,
          shorterThanDuration:
            state.ignoreCases.reportingBehaviourDropDown.shorterThanDuration,

          longerThanVal:
            state.ignoreCases.reportingBehaviourDropDown.longerThanVal,
          longerThanDuration:
            state.ignoreCases.reportingBehaviourDropDown.longerThanDuration,
        },
      },
    });
  }, [state]);

  const handleFormSubmit = async () => {
    /** Taking the filterBar state and converting into minutes and setting appStateContext*/
    const getShorterTimeinMinutes = convertTimeToMinutes(
      Number(
        userInputValues.ignoreCases.reportingBehaviourDropDown.shorterThanVal
      ),
      String(
        userInputValues.ignoreCases.reportingBehaviourDropDown
          .shorterThanDuration
      )
    );

    const getLongerTimeInMinutes = convertTimeToMinutes(
      Number(
        userInputValues.ignoreCases.reportingBehaviourDropDown.longerThanVal
      ),
      String(
        userInputValues.ignoreCases.reportingBehaviourDropDown
          .longerThanDuration
      )
    );

    showToast({
      type: "success",
      title: "Success",
      message: <>Configurations Added Successfully.</>,
    });

    setAppStateValues({
      ...userInputValues,
      ignoreCases: {
        valuesInMinutes: {
          shorterTime: getShorterTimeinMinutes,
          longerTime: getLongerTimeInMinutes,
        },
        reportingBehaviourDropDown:
          userInputValues.ignoreCases.reportingBehaviourDropDown,
      },
    });
    setSettingsModalState(false);
  };

  // console.count();

  return (
    <Page>
      <Page.Header>
        <Header
          setInfoModalState={setInfoModalState}
          setSettingModalState={setSettingsModalState}
        />
      </Page.Header>
      <Page.Main>
        {/* Any Additonal Routes Needed, you can add here */}
        <Routes>
          <Route
            element={<Home setModalState={setSettingsModalState} />}
            path="/"
          />
          <Route element={<PageNotFound />} path="*" />
        </Routes>

        {/* Modals For Info & Settings */}
        <KPIModal
          modalTitle="KPI Information"
          open={infoModalState}
          onClose={() => setInfoModalState(false)}
        >
          {InformationModalData}
        </KPIModal>
        <KPIModal
          modalTitle="KPI Configuration Panel"
          open={settingsModalState}
          onClose={() => {
            setSettingsModalState(false);
            setUserInputValues(state); //onClose, setting to prev state
          }}
          footer={<KPIButton label="Save" onClick={handleFormSubmit} />}
        >
          {/* Modal For User Input */}
          <Flex flexDirection="column" gap={12}>
            <div>
              <Heading level={4}>Calculation Variables</Heading>
              <br />
              <KPINumberInput
                label="Baseline MTTD (In Minutes)"
                value={userInputValues.baseline.mttd}
                onChange={(value: number) =>
                  setUserInputValues((prev) => ({
                    ...prev,
                    baseline: {
                      mttr: userInputValues.baseline.mttr,
                      mttd: value,
                    },
                  }))
                }
                placeholder="Enter Baseline Minutes for MTTD"
              />
              <br />
              <KPINumberInput
                label="Baseline MTTR (In Minutes)"
                value={userInputValues.baseline.mttr}
                onChange={(value: number) =>
                  setUserInputValues((prev) => ({
                    ...prev,
                    baseline: {
                      mttd: userInputValues.baseline.mttd,
                      mttr: value,
                    },
                  }))
                }
                placeholder="Enter Baseline Minutes for MTTR"
              />
              <br />
              <Flex justifyContent="space-between">
                <KPINumberInput
                  label="No.Of People Working On A Problem"
                  value={userInputValues.salary.defaultPeopleWorkingOnAProblem}
                  onChange={(value: number) =>
                    setUserInputValues((prev) => ({
                      ...prev,
                      salary: {
                        ...userInputValues.salary,
                        defaultPeopleWorkingOnAProblem: value,
                      },
                    }))
                  }
                  placeholder="Enter average people working on a problem"
                />
                <KPINumberInput
                  label="Per-Hour Salary ($)"
                  value={userInputValues.salary.salaryValue}
                  onChange={(value: number) =>
                    setUserInputValues((prev) => ({
                      ...prev,
                      salary: {
                        ...userInputValues.salary,
                        salaryValue: value,
                      },
                    }))
                  }
                  placeholder="Enter Per-Hour Salary"
                />
              </Flex>
            </div>
            <Divider />
            <div>
              <Heading level={4}>Ignore Cases</Heading>
              <br />
              <ReportingBehaviorFilter
                appValues={userInputValues}
                reportingBehavior={
                  userInputValues.ignoreCases.reportingBehaviourDropDown
                }
                setReportingBehavior={setUserInputValues}
              />
            </div>
          </Flex>
        </KPIModal>
      </Page.Main>
    </Page>
  );
};

export default App;
