import React, { useState } from "react";
import { FilterBar, SelectV2 } from "@dynatrace/strato-components-preview";
import KPINumberInput from "./KPINumberInput";
import { reportingOptions } from "src/app/constants/options";

export const ReportingBehaviorFilter = () => {
  const [resportingProblems, setReportingProblems] = useState({
    shorterThanVal: 5,
    shorterThanDuration: "min",

    longerThanVal: 900,
    longerThanDuration: "min",
  });

  return (
    <FilterBar
      onFilterChange={(e) => {
        console.log(e, "event");
      }}
    >
      <FilterBar.Item
        name="ignore-shorter"
        label="Ignore problems shorter than"
      >
        <KPINumberInput
          label=""
          value={resportingProblems.shorterThanVal}
          onChange={(e) =>
            setReportingProblems((prev) => ({
              ...prev,
              shorterThanVal: Number(e),
            }))
          }
          placeholder="Enter Baseline for MTTD"
        />
      </FilterBar.Item>
      <FilterBar.Item name="shorter-val" label="Problem duration in">
        <SelectV2
          value={resportingProblems.shorterThanDuration}
          onChange={(e) =>
            setReportingProblems((prev) => ({
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
      &nbsp;&nbsp;&nbsp;&nbsp;
      <FilterBar.Item name="ignore-longer" label="Ignore problems longer than">
        <KPINumberInput
          label=""
          value={resportingProblems.longerThanVal}
          onChange={(e) =>
            setReportingProblems((prev) => ({
              ...prev,
              longerThanVal: Number(e),
            }))
          }
          placeholder="Enter Baseline for MTTD"
        />
      </FilterBar.Item>
      <FilterBar.Item name="longer-val" label="Problem duration in">
        <SelectV2
          value={resportingProblems.longerThanDuration}
          onChange={(e) =>
            setReportingProblems((prev) => ({
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
