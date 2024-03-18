import { Flex, Page, showToast } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import type { AppCompProps } from "types";
import Header from "./components/Header";
import KPIButton from "./components/ReusableComponents/KPIButton";
import KPIModal from "./components/ReusableComponents/KPIModal";
import KPINumberInput from "./components/ReusableComponents/KPINumberInput";
import { InformationModalData } from "./constants/ModalData";
import Home from "./pages/Home";
import { setAppState } from "./utils/appState";
import { stateClient } from "@dynatrace-sdk/client-state";
import { useMetricsContext } from "./hooks/context/MetricsContext";
import { estimatedSalaries } from "./constants/options";

const App: React.FC<AppCompProps> = () => {
  /** States For settings, info modal open and close  */
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);

  const { initialMttdValue, initialMttrValue, salaryValue, setMetricsData } =
    useMetricsContext();

  const [userInputValues, setUserInputValues] = useState({
    mttd: 0,
    mttr: 0,
    salaryInput: 0,
  });

  const [modalCloseIndication, setModalCloseIndication] =
    useState<boolean>(false);

  useEffect(() => {
    setUserInputValues({
      mttd: initialMttdValue,
      mttr: initialMttrValue,
      salaryInput: salaryValue,
    });
  }, [initialMttdValue, initialMttrValue, salaryValue]);

  useEffect(() => {
    setMetricsData({
      initialMttdValue: userInputValues.mttd,
      initialMttrValue: userInputValues.mttr,
      salaryValue: userInputValues.salaryInput,
    });
    const setMetricsDatafunc = async () => {
      try {
        const metricResponse = await stateClient.getAppState({
          key: "kpi-metrics-value",
        });
        const salaryResponse = await stateClient.getAppState({
          key: "salary-data",
        });

        const prevStoredAppData = JSON.parse(metricResponse.value);
        const prevStoredSalaryData = JSON.parse(salaryResponse.value);

        console.log(prevStoredSalaryData, "appdata");

        setMetricsData({ ...prevStoredAppData, ...prevStoredSalaryData });

        setAppState({
          key: "kpi-metrics-value",
          value: JSON.stringify(prevStoredAppData),
        });

        setAppState({
          key: "salary-data",
          value: JSON.stringify(prevStoredSalaryData),
        });
      } catch (err) {
        setAppState({
          key: "kpi-metrics-value",
          value: JSON.stringify({ initialMttdValue, initialMttrValue }),
        });

        setAppState({
          key: "salary-data",
          value: JSON.stringify({
            salaryValue,
            estimatedSalaries: estimatedSalaries,
          }),
        });
        console.log(err);
      } finally {
        setModalCloseIndication(false);
      }
    };

    setMetricsDatafunc();
  }, [modalCloseIndication]);

  console.log(
    initialMttdValue,
    initialMttrValue,
    salaryValue,
    userInputValues,
    "val"
  );

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
          footer={
            <KPIButton
              label="Save"
              onClick={async () => {
                showToast({
                  type: "success",
                  title: "Success",
                  message: <>Configurations Added Successfully.</>,
                });

                setModalCloseIndication(true);
                setSettingsModalState(false);

                await setAppState({
                  key: "kpi-metrics-value",
                  value: JSON.stringify({
                    initialMttdValue: userInputValues.mttd,
                    initialMttrValue: userInputValues.mttr,
                  }),
                });

                await setAppState({
                  key: "salary-data",
                  value: JSON.stringify({
                    salaryValue: userInputValues.salaryInput,
                    estimatedSalaries,
                  }),
                });
              }}
            />
          }
        >
          {/* Modal For User Input */}
          <Flex flexDirection="column" gap={12}>
            <KPINumberInput
              label="Baseline MTTD"
              value={userInputValues.mttd}
              onChange={
                (value: number) =>
                  setUserInputValues((prev) => ({ ...prev, mttd: value }))
                // setMetricsData({ initialMttdValue: value })
              }
              placeholder="Enter baseline for MTTD"
            />
            <KPINumberInput
              label="Baseline MTTR"
              value={userInputValues.mttr}
              onChange={
                (value: number) =>
                  setUserInputValues((prev) => ({ ...prev, mttr: value }))
                // setMetricsData({ initialMttrValue: value })
              }
              placeholder="Enter baseline for MTTR"
            />

            <KPINumberInput
              label="Salary ($)"
              value={userInputValues.salaryInput}
              onChange={
                (value: number) =>
                  setUserInputValues((prev) => ({
                    ...prev,
                    salaryInput: value,
                  }))
                // setMetricsData({ salaryValue: value })
              }
              placeholder="Enter salary-data"
            />
          </Flex>
        </KPIModal>
      </Page.Main>
    </Page>
  );
};

export default App;
