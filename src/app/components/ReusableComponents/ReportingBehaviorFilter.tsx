import React from "react";
import {
  Divider,
  FilterBar,
  FilterItemValues,
  Flex,
  SelectV2,
} from "@dynatrace/strato-components-preview";
import KPINumberInput from "./KPINumberInput";
import { reportingOptions } from "src/app/constants/options";
import { convertTimeToMinutes } from "src/app/utils/timeConverters";
import { useAppContext } from "src/app/hooks/Context-API/AppContext";

export const ReportingBehaviorFilter = () => {
  const { reportingBehavior, setReportingBehavior, setReportingProblemsData } =
    useAppContext();

  return (
    <FilterBar
      onFilterChange={({
        ignoreShorter,
        shorterVal,
        ignoreLonger,
        longerVal,
      }: FilterItemValues) => {
        const getShorterTimeinMinutes = convertTimeToMinutes(
          Number(ignoreShorter.value),
          String(shorterVal.value)
        );

        const getLongerTimeInMinutes = convertTimeToMinutes(
          Number(ignoreLonger.value),
          String(longerVal.value)
        );

        setReportingProblemsData({
          shorterTimeInMin: getShorterTimeinMinutes,
          longerTimeInMin: getLongerTimeInMinutes,
        });
      }}
    >
      <FilterBar.Item name="ignoreShorter" label="Ignore problems shorter than">
        <KPINumberInput
          label=""
          value={reportingBehavior.shorterThanVal}
          onChange={(e) =>
            setReportingBehavior((prev) => ({
              ...prev,
              shorterThanVal: Number(e),
            }))
          }
          placeholder="Enter Baseline for MTTD"
        />
      </FilterBar.Item>
      <FilterBar.Item name="shorterVal" label="Problem duration in">
        <SelectV2
          value={reportingBehavior.shorterThanDuration}
          onChange={(e) =>
            setReportingBehavior((prev) => ({
              ...prev,
              shorterThanDuration: String(e),
            }))
          }
        >
          <SelectV2.Trigger width="200px" />
          <SelectV2.Content>
            {reportingOptions.map((option) => (
              <SelectV2.Option key={option.value} value={option.value}>
                {option.label}
              </SelectV2.Option>
            ))}
          </SelectV2.Content>
        </SelectV2>
      </FilterBar.Item>

      <FilterBar.Item name="hidden" label="">
        <Flex height={50} style={{ marginLeft: "25px", marginRight: "25px" }}>
          <Divider orientation="vertical" />
        </Flex>
      </FilterBar.Item>

      <FilterBar.Item name="ignoreLonger" label="Ignore problems longer than">
        <KPINumberInput
          label=""
          value={reportingBehavior.longerThanVal}
          onChange={(e) =>
            setReportingBehavior((prev) => ({
              ...prev,
              longerThanVal: Number(e),
            }))
          }
          placeholder="Enter Baseline for MTTD"
        />
      </FilterBar.Item>
      <FilterBar.Item name="longerVal" label="Problem duration in">
        <SelectV2
          value={reportingBehavior.longerThanDuration}
          onChange={(e) =>
            setReportingBehavior((prev) => ({
              ...prev,
              longerThanDuration: String(e),
            }))
          }
        >
          <SelectV2.Trigger width="200px" />
          <SelectV2.Content>
            {reportingOptions.map((option) => (
              <SelectV2.Option key={option.value} value={option.value}>
                {option.label}
              </SelectV2.Option>
            ))}
          </SelectV2.Content>
        </SelectV2>
      </FilterBar.Item>
    </FilterBar>
  );
};
