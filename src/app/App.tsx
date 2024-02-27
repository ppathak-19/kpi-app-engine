import { Flex, Page } from "@dynatrace/strato-components-preview";
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

const App: React.FC<AppCompProps> = () => {
  /** States For settings, info modal open and close  */
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);
  const [showNestedModal, setNestedModalState] = useState(false);

  const { initialMttdValue, initialMttrValue, setMetricsData } =
    useMetricsContext();

  const [infoModalState2, setInfoModalState2] = useState(false);

  useEffect(() => {
    const setMetricsDatafunc = async () => {
      try {
        const res = await stateClient.getAppState({ key: "data" });
        const prevStoredAppData = JSON.parse(res.value);
        setMetricsData(prevStoredAppData);

        console.log(
          prevStoredAppData.initialMttdValue,
          prevStoredAppData.initialMttrValue,
          "value"
        );

        setAppState({
          key: "data",
          value: JSON.stringify(prevStoredAppData),
        });
      } catch (err) {
        setAppState({
          key: "data",
          value: JSON.stringify({ initialMttdValue, initialMttrValue }),
        });
        console.log(err);
      } finally {
        setInfoModalState2(false);
      }
    };

    setMetricsDatafunc();
  }, [infoModalState2]);

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
          <Route element={<Home />} path="/" />
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
                setNestedModalState(true);
                setInfoModalState2(true);

                await setAppState({
                  key: "data",
                  value: JSON.stringify({ initialMttdValue, initialMttrValue }),
                });
              }}
            />
          }
        >
          {/* Modal For User Input */}
          <Flex flexDirection="column" gap={12}>
            <KPINumberInput
              label="Baseline MTTD"
              value={initialMttdValue}
              onChange={(value: number) =>
                setMetricsData({ initialMttdValue: value })
              }
              placeholder="Enter baseline for MTTD"
            />
            <KPINumberInput
              label="Baseline MTTR"
              value={initialMttrValue}
              onChange={(value: number) =>
                setMetricsData({ initialMttrValue: value })
              }
              placeholder="Enter baseline for MTTR"
            />
          </Flex>

          {/* nested modal for successfull save or not */}
          <KPIModal
            modalTitle="Nested Modal"
            open={showNestedModal}
            onClose={() => {
              setNestedModalState(false);
              setSettingsModalState(false);
            }}
          >
            {InformationModalData}
          </KPIModal>
        </KPIModal>
      </Page.Main>
    </Page>
  );
};

export default App;
