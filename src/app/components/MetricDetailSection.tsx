import {
  Container,
  Flex,
  Heading,
  SkeletonText,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { MetricDetailsCardSection, RequiredDataResponse } from "types";
import { CustomSelect } from "./ReusableComponents/CustomSelect";
import { aggregatorOptions, timeFrameOptions } from "../constants/options";
import { useStructuredAggregationDetails } from "../hooks/useStructuredAggregationDetails";

const initialMetrics = {
  currentDayValue: "0",
  baselinePercentage: "0",
  previousDayValue: "0",
  comparisonWithPreviousDay: "0",
};

interface MetricDetailSectionProps {
  daysData: RequiredDataResponse;
  selectedTimeFrame: string | null;
  setSelectedTimeFrame: (val: string) => void;
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
}: MetricDetailSectionProps) => {
  const [aggregatorValue, setAggregatorValue] = useState<string | null>(
    "median"
  );

  const [mttdData, setMttdData] =
    useState<MetricDetailsCardSection>(initialMetrics);
  const [mttrData, setMttrData] =
    useState<MetricDetailsCardSection>(initialMetrics);
  const [loading, setLoading] = useState(false);

  const [structuredDetails] = useStructuredAggregationDetails(daysData);

  // set the aggregation based on selected aggregation value
  useEffect(() => {
    const mttdKey = `${String(aggregatorValue).toLowerCase()}MTTD`;
    const mttrKey = `${String(aggregatorValue).toLowerCase()}MTTR`;

    const mttdItem = structuredDetails.find(
      (item) => Object.keys(item)[0] === mttdKey
    );
    const mttrItem = structuredDetails.find(
      (item) => Object.keys(item)[0] === mttrKey
    );

    setMttdData(
      mttdItem ? mttdItem[mttdKey] : ({} as MetricDetailsCardSection)
    );
    setMttrData(
      mttrItem ? mttrItem[mttrKey] : ({} as MetricDetailsCardSection)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aggregatorValue, daysData]);

  return (
    <Flex flexDirection="column" width="100%">
      <Flex justifyContent="space-between">
        <CustomSelect
          label="Select Aggregation"
          value={aggregatorValue}
          onChange={setAggregatorValue}
          options={aggregatorOptions}
          setLoading={setLoading}
        />
        <CustomSelect
          label="Select Timeframe"
          value={selectedTimeFrame}
          onChange={setSelectedTimeFrame}
          options={timeFrameOptions}
          setLoading={setLoading}
        />
      </Flex>

      {/* Sections  */}

      <Flex flexDirection="row" width="100%">
        <Container variant="minimal" width="50%">
          <Heading level={5} as="h2">
            MTTD
          </Heading>
          {daysData.isLoading || loading ? (
            <SkeletonText lines={4} />
          ) : (
            <div style={{ margin: "1rem" }}>
              <InfoItem
                title={`Last ${selectedTimeFrame} days (Minutes)`}
                value={mttdData.currentDayValue}
              />
              <InfoItem
                title={`${selectedTimeFrame} days prior (Minutes)`}
                value={mttdData.previousDayValue}
              />
              <InfoItem
                title={`Baseline comparison: past ${selectedTimeFrame} days`}
                value={mttdData.baselinePercentage}
              />
              <InfoItem
                title={`Comparing Recent ${selectedTimeFrame} Days with ${selectedTimeFrame} Days Prior`}
                value={mttdData.comparisonWithPreviousDay}
              />
            </div>
          )}
        </Container>

        <Container variant="minimal" width="50%">
          <Heading level={5} as="h2">
            MTTR
          </Heading>
          {daysData.isLoading || loading ? (
            <SkeletonText lines={4} />
          ) : (
            <div style={{ margin: "1rem" }}>
              <InfoItem
                title={"Last 2 days (Minutes)"}
                value={mttrData.currentDayValue}
              />
              <InfoItem
                title={"2 days prior (Minutes)"}
                value={mttrData.previousDayValue}
              />
              <InfoItem
                title={"Baseline comparison: past 2 days"}
                value={mttrData.baselinePercentage}
              />
              <InfoItem
                title={"Comparing Recent 2 Days with 2 Days Prior"}
                value={mttrData.comparisonWithPreviousDay}
              />
            </div>
          )}
        </Container>
      </Flex>
    </Flex>
  );
};

export default MetricDetailSection;
