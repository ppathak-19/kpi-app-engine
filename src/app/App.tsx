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
  reportingDropDownInitialValues,
  type InitialAppStateType,
  type ReportingBehaviorFilterTypes,
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

  /** State for ignorecases having additional dropdown like `min`, `hrs` etc.. */
  const [reportingBehavior, setReportingBehavior] =
    useState<ReportingBehaviorFilterTypes>(reportingDropDownInitialValues);

  useEffect(() => {
    setUserInputValues({
      baseline: {
        mttd: state.baseline.mttd,
        mttr: state.baseline.mttr,
      },
      salary: state.salary,
      ignoreCases: {
        longerTime: state.ignoreCases.longerTime,
        shorterTime: state.ignoreCases.shorterTime,
      },
    });
  }, [state]);

  const handleFormSubmit = async () => {
    /** Taking the filterBar state and converting into minutes and setting appStateContext*/
    const getShorterTimeinMinutes = convertTimeToMinutes(
      Number(reportingBehavior.shorterThanVal),
      String(reportingBehavior.shorterThanDuration)
    );

    const getLongerTimeInMinutes = convertTimeToMinutes(
      Number(reportingBehavior.longerThanVal),
      String(reportingBehavior.longerThanDuration)
    );

    showToast({
      type: "success",
      title: "Success",
      message: <>Configurations Added Successfully.</>,
    });

    setAppStateValues({
      ...userInputValues,
      ignoreCases: {
        shorterTime: getShorterTimeinMinutes,
        longerTime: getLongerTimeInMinutes,
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
                label="Baseline MTTD"
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
                label="Baseline MTTR"
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
              <KPINumberInput
                label="Salary ($)"
                value={userInputValues.salary}
                onChange={(value: number) =>
                  setUserInputValues((prev) => ({
                    ...prev,
                    salary: value,
                  }))
                }
                placeholder="Enter Per-Hour Salary"
              />
            </div>
            <Divider />
            <div>
              <Heading level={4}>Ignore Cases</Heading>
              <br />
              <ReportingBehaviorFilter
                reportingBehavior={reportingBehavior}
                setReportingBehavior={setReportingBehavior}
              />
            </div>
          </Flex>
        </KPIModal>
      </Page.Main>
    </Page>
  );
};

export default App;
