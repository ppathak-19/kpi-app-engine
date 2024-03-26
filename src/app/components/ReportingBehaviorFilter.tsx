import {
  Divider,
  Flex,
  FormField,
  SelectV2,
} from "@dynatrace/strato-components-preview";
import React from "react";
import { reportingOptions } from "src/app/constants/options";
import { type ReportingBehaviorFilterTypes } from "src/app/hooks/Context-API/InitialAppStates";
import KPINumberInput from "./ReusableComponents/KPINumberInput";

type ReportingBehaviorFilterCompProps = {
  reportingBehavior: ReportingBehaviorFilterTypes;
  setReportingBehavior: React.Dispatch<
    React.SetStateAction<ReportingBehaviorFilterTypes>
  >;
};

const ReportingBehaviorFilter: React.FC<ReportingBehaviorFilterCompProps> = (
  props
) => {
  const { reportingBehavior, setReportingBehavior } = props;

  return (
    <Flex>
      <KPINumberInput
        label="Ignore problems shorter than"
        value={reportingBehavior.shorterThanVal}
        onChange={(e) =>
          setReportingBehavior((prev) => ({
            ...prev,
            shorterThanVal: Number(e),
          }))
        }
        placeholder="Enter Duration of Problem"
      />

      <FormField style={{ width: "100%" }} label="Problem duration in">
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
      </FormField>

      <Flex height={50} style={{ marginLeft: "25px", marginRight: "25px" }}>
        <Divider orientation="vertical" />
      </Flex>

      <KPINumberInput
        label="Ignore problems longer than"
        value={reportingBehavior.longerThanVal}
        onChange={(e) =>
          setReportingBehavior((prev) => ({
            ...prev,
            longerThanVal: Number(e),
          }))
        }
        placeholder="Enter Duration of Problem"
      />

      <FormField style={{ width: "100%" }} label="Problem duration in">
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
      </FormField>
    </Flex>
  );
};

export default ReportingBehaviorFilter;
