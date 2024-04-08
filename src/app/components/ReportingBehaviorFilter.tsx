import {
  Divider,
  Flex,
  FormField,
  SelectV2,
} from "@dynatrace/strato-components-preview";
import React from "react";
import { reportingOptions } from "src/app/constants/options";
import {
  type InitialAppStateType,
  type ReportingBehaviorFilterTypes,
} from "src/app/hooks/Context-API/InitialAppStates";
import type { DurationTypes } from "types";
import KPINumberInput from "./ReusableComponents/KPINumberInput";

type ReportingBehaviorFilterCompProps = {
  appValues: InitialAppStateType;
  reportingBehavior: ReportingBehaviorFilterTypes;
  setReportingBehavior: React.Dispatch<
    React.SetStateAction<InitialAppStateType>
  >;
};

const ReportingBehaviorFilter: React.FC<ReportingBehaviorFilterCompProps> = (
  props
) => {
  const { appValues, reportingBehavior, setReportingBehavior } = props;

  return (
    <Flex>
      <KPINumberInput
        label="Ignore problems shorter than"
        value={reportingBehavior.shorterThanVal}
        onChange={(e) =>
          setReportingBehavior({
            ...appValues,
            ignoreCases: {
              valuesInMinutes: appValues.ignoreCases.valuesInMinutes,
              reportingBehaviourDropDown: {
                ...appValues.ignoreCases.reportingBehaviourDropDown,
                shorterThanVal: Number(e),
              },
            },
          })
        }
        placeholder="Enter Duration of Problem"
      />

      <FormField style={{ width: "100%" }} label="Problem duration in">
        <SelectV2
          value={reportingBehavior.shorterThanDuration}
          onChange={(e) =>
            setReportingBehavior({
              ...appValues,
              ignoreCases: {
                valuesInMinutes: appValues.ignoreCases.valuesInMinutes,
                reportingBehaviourDropDown: {
                  ...appValues.ignoreCases.reportingBehaviourDropDown,
                  shorterThanDuration: String(e) as DurationTypes,
                },
              },
            })
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
          setReportingBehavior({
            ...appValues,
            ignoreCases: {
              valuesInMinutes: appValues.ignoreCases.valuesInMinutes,
              reportingBehaviourDropDown: {
                ...appValues.ignoreCases.reportingBehaviourDropDown,
                longerThanVal: Number(e),
              },
            },
          })
        }
        placeholder="Enter Duration of Problem"
      />

      <FormField style={{ width: "100%" }} label="Problem duration in">
        <SelectV2
          value={reportingBehavior.longerThanDuration}
          onChange={(e) =>
            setReportingBehavior({
              ...appValues,
              ignoreCases: {
                valuesInMinutes: appValues.ignoreCases.valuesInMinutes,
                reportingBehaviourDropDown: {
                  ...appValues.ignoreCases.reportingBehaviourDropDown,
                  longerThanDuration: String(e) as DurationTypes,
                },
              },
            })
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
