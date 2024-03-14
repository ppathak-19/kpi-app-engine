import {
  Container,
  Flex,
  Heading,
  SkeletonText,
} from "@dynatrace/strato-components-preview";
import React from "react";
import type { RequiredDataResponse, aggregationsType } from "types";
import { aggregatorOptions, timeFrameOptions } from "../constants/options";
import { CustomSelect } from "./ReusableComponents/CustomSelect";

interface MetricDetailSectionProps {
  daysData: RequiredDataResponse;
  selectedTimeFrame: string | null;
  setSelectedTimeFrame: (val: string) => void;
  clickedAggregation: aggregationsType;
  setAggregationForTimeSeries: (val: string) => void;
}

const InfoItem = ({ title, value }) => {
  const isPercentage = value?.includes("%") && value.includes("-");
  const isMin = value?.includes("min");
  const textColor = isMin ? "" : isPercentage ? "red" : "green";
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <p style={{ fontWeight: "600" }}>{title}</p>
      <hr
        style={{
          margin: "0 1rem",
          flex: 1,
          border: "none",
          height: "1px",
          backgroundColor: "#d5d5e1",
        }}
      />
      <p style={{ fontWeight: "600", color: textColor }}>{value}</p>
    </Flex>
  );
};

const MetricDetailSection = ({
  daysData,
  selectedTimeFrame,
  setSelectedTimeFrame,
  clickedAggregation,
  setAggregationForTimeSeries,
}: MetricDetailSectionProps) => {
  // const [clickedAggregation, setAggregatorValue] = useState<string | null>(
  //   "median"
  // );

  const handleTimeFrameChange = (val: string) => {
    setSelectedTimeFrame(val);
  };

  const handleAggregationChange = (val: string) => {
    setAggregationForTimeSeries(val);
  };

  const daysPriorLabel =
    selectedTimeFrame === "-w"
      ? "Last week (Minutes)"
      : selectedTimeFrame === "-m"
      ? "Last month (Minutes)"
      : `${selectedTimeFrame} days prior (Minutes)`;

  const lastDaysLabel =
    selectedTimeFrame === "-w"
      ? "This week (Minutes)"
      : selectedTimeFrame === "-m"
      ? "This month (Minutes)"
      : `Last ${selectedTimeFrame} days (Minutes)`;

  const baseLineComparisonLabel =
    selectedTimeFrame === "-w"
      ? "Baseline comparison"
      : selectedTimeFrame === "-m"
      ? "Baseline comparison"
      : `Baseline comparison: past ${selectedTimeFrame} days`;

  const comparingRecentLabel =
    selectedTimeFrame === "-w"
      ? "Comparing this week with last week"
      : selectedTimeFrame === "-m"
      ? "Comparing this week with last week"
      : `Comparing Recent ${selectedTimeFrame} Days with ${selectedTimeFrame} Days Prior`;

  return (
    <Flex flexDirection="column" width="100%">
      <Flex justifyContent="space-between">
        <CustomSelect
          label="Select Aggregation"
          value={clickedAggregation}
          onChange={handleAggregationChange}
          options={aggregatorOptions}
        />
        <CustomSelect
          label="Select Timeframe"
          value={selectedTimeFrame}
          onChange={handleTimeFrameChange}
          options={timeFrameOptions}
        />
      </Flex>

      {/* Sections  */}

      <Flex flexDirection="row" width="100%">
        <Container variant="minimal" width="50%">
          <Heading level={5} as="h2">
            MTTD
          </Heading>
          {daysData.isLoading ? (
            <SkeletonText lines={4} />
          ) : (
            <div style={{ margin: "1rem" }}>
              <InfoItem
                title={lastDaysLabel}
                value={
                  daysData?.responseWithCurrentDayData[
                    `${clickedAggregation}MTTD`
                  ]
                }
              />
              <InfoItem
                title={daysPriorLabel}
                value={
                  daysData?.responseWithPreviousDayData[
                    `${clickedAggregation}MTTD`
                  ]
                }
              />
              <InfoItem
                title={baseLineComparisonLabel}
                value={
                  daysData?.responseInPercentageWithBaseline[
                    `${clickedAggregation}MTTD`
                  ] + "%"
                }
              />
              <InfoItem
                title={comparingRecentLabel}
                value={
                  daysData?.responseInPercentageWithPreviousDay[
                    `${clickedAggregation}MTTD`
                  ] + "%"
                }
              />
            </div>
          )}
        </Container>

        <Container variant="minimal" width="50%">
          <Heading level={5} as="h2">
            MTTR
          </Heading>
          {daysData.isLoading ? (
            <SkeletonText lines={4} />
          ) : (
            <div style={{ margin: "1rem" }}>
              <InfoItem
                title={lastDaysLabel}
                value={
                  daysData?.responseWithCurrentDayData[
                    `${clickedAggregation}MTTR`
                  ]
                }
              />
              <InfoItem
                title={daysPriorLabel}
                value={
                  daysData?.responseWithPreviousDayData[
                    `${clickedAggregation}MTTR`
                  ]
                }
              />
              <InfoItem
                title={baseLineComparisonLabel}
                value={
                  daysData?.responseInPercentageWithBaseline[
                    `${clickedAggregation}MTTR`
                  ] + "%"
                }
              />
              <InfoItem
                title={comparingRecentLabel}
                value={
                  daysData?.responseInPercentageWithPreviousDay[
                    `${clickedAggregation}MTTR`
                  ] + "%"
                }
              />
            </div>
          )}
        </Container>
      </Flex>
    </Flex>
  );
};

export default MetricDetailSection;
