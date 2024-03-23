import {
  Divider,
  Flex,
  Page,
  showToast,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import type { AppCompProps } from "types";
import Header from "./components/Header";
import KPIButton from "./components/ReusableComponents/KPIButton";
import KPIModal from "./components/ReusableComponents/KPIModal";
import KPINumberInput from "./components/ReusableComponents/KPINumberInput";
import { InformationModalData } from "./constants/ModalData";
import { useAppContext } from "./hooks/Context-API/AppContext";
import {
  type InitialAppStateType,
  initialAppStateValues,
} from "./hooks/Context-API/InitialAppStates";
import Home from "./pages/Home";
import { ReportingBehaviorFilter } from "./components/ReusableComponents/ReportingBehaviorFilter";

const App: React.FC<AppCompProps> = () => {
  /** States For settings, info modal open and close  */
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);

  const { state, setAppStateValues } = useAppContext();

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
    });
  }, [state]);

  const handleFormSubmit = async () => {
    showToast({
      type: "success",
      title: "Success",
      message: <>Configurations Added Successfully.</>,
    });

    setAppStateValues(userInputValues);
    setSettingsModalState(false);
  };

  console.count();
  console.log({ state });

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
          onClose={() => setSettingsModalState(false)}
          footer={<KPIButton label="Save" onClick={handleFormSubmit} />}
        >
          {/* Modal For User Input */}
          <Flex flexDirection="column" gap={12}>
            <div>
              <h3>Calculation Variables</h3>
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
                placeholder="Enter Baseline for MTTD"
              />
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
                placeholder="Enter Baseline for MTTR"
              />

              <KPINumberInput
                label="Salary ($)"
                value={userInputValues.salary}
                onChange={(value: number) =>
                  setUserInputValues((prev) => ({
                    ...prev,
                    salaryInput: value,
                  }))
                }
                placeholder="Enter Salary-data"
              />
            </div>
            <Divider />
            <div>
              <h3>Reporting Behavior</h3>
              <ReportingBehaviorFilter />

              {/* <KPINumberInput
                  label="Ignore problems longer than"
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
                  placeholder="Enter Baseline for MTTR"
                /> */}
            </div>
          </Flex>
        </KPIModal>
      </Page.Main>
    </Page>
  );
};

export default App;
