import { Flex, Page } from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import type { AppCompProps } from "types";
import Header from "./components/Header";
import KPIButton from "./components/ReusableComponents/KPIButton";
import KPIModal from "./components/ReusableComponents/KPIModal";
import KPINumberInput from "./components/ReusableComponents/KPINumberInput";
import { InformationModalData } from "./constants/ModalData";
import Home from "./pages/Home";

const App: React.FC<AppCompProps> = () => {
  /** States For settings, info modal open and close  */
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);
  const [showNestedModal, setNestedModalState] = useState(false);

  /** States For Baseline mttr,mttd values */
  const [initialMttdValue, setMttdValue] = useState<number | null>(0);
  const [initialMttrValue, setMttrValue] = useState<number | null>(0);

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
              onClick={() => {
                console.log({ initialMttdValue, initialMttrValue });
                setNestedModalState(true);
              }}
            />
          }
        >
          {/* Modal For User Input */}
          <Flex flexDirection="column" gap={12}>
            <KPINumberInput
              label="Baseline MTTD"
              value={initialMttdValue}
              onChange={setMttdValue}
              placeholder="Enter baseline for MTTD"
            />
            <KPINumberInput
              label="Baseline MTTR"
              value={initialMttrValue}
              onChange={setMttrValue}
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
