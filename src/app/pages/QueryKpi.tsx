import {
  Button,
  DataTable,
  Flex,
  Heading,
  Surface,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps } from "types";
import { queryKPITableColumnV2 } from "../constants/problemTableColumns";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import {
  getLastMonth,
  getTwoDaysBeforeLastTwoDays,
} from "../utils/timeConverters";
import { InformationIcon, SettingIcon } from "@dynatrace/strato-icons";
import { InfoModal } from "../components/modals/InfoModal";
import { SettingsModal } from "../components/modals/settingsModal";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [infoModalState, setInfoModalState] = useState(false);
  const [settingsModalState, setSettingsModalState] = useState(false);

  /** Getting Metrices for Last 2 Days */
  const last2DaysData = useGetKPIMetrices({
    timeline: "now()-2d",
    shouldUseTimeFrame: false,
  });

  /** Getting Metrices for Last 7 Days */
  const last7DaysData = useGetKPIMetrices({
    timeline: "now()-7d",
    shouldUseTimeFrame: false,
  });

  /** Getting Metrices for Previous Month */
  const last30DaysData = useGetKPIMetrices({
    timeline: getLastMonth(),
    shouldUseTimeFrame: true,
  });

  useEffect(() => {
    getTwoDaysBeforeLastTwoDays();
  }, []);

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>Problems Overview</TitleBar.Title>
        <TitleBar.Suffix>
          <Flex gap={4}>
            <Button
              variant="default"
              data-testid="open-info-modal-button"
              onClick={() => setInfoModalState(true)}
            >
              <Button.Prefix>{<InformationIcon />}</Button.Prefix>
              Info
            </Button>
            <Button
              variant="default"
              data-testid="open-settings-modal-button"
              onClick={() => setSettingsModalState(true)}
            >
              <Button.Prefix>{<SettingIcon />}</Button.Prefix>Settings
            </Button>
          </Flex>
        </TitleBar.Suffix>
      </TitleBar>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Last 2 Days Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last2DaysData.isLoading}
          data={!!last2DaysData ? [last2DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Last 7 Days Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last7DaysData.isLoading}
          data={!!last7DaysData ? [last7DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>Previous Month Data</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumnV2}
          loading={last30DaysData.isLoading}
          data={!!last30DaysData ? [last30DaysData] : []}
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      </Flex>

      <InfoModal
        infoModalState={infoModalState}
        setInfoModalState={setInfoModalState}
      />
      <SettingsModal
        settingsModalState={settingsModalState}
        setSettingsModalState={setSettingsModalState}
      />
    </Surface>
  );
};

export default QueryKpi;
