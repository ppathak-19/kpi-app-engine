import {
  Container,
  Flex,
  FormField,
  Heading,
  SelectV2,
  SkeletonText,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { MetricDetailsCardSection, RequiredDataResponse } from "types";

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

export const MetricDetailSection = ({
  daysData,
  selectedTimeFrame,
  setSelectedTimeFrame,
}: MetricDetailSectionProps) => {
  const [aggregatorValue, setAggregatorValue] = useState<string | null>(
    "median"
  );
  const [structuredDetails, setStructuredDetails] = useState<any[]>([]);
  const [mttdData, setMttdData] =
    useState<MetricDetailsCardSection>(initialMetrics);
  const [mttrData, setMttrData] =
    useState<MetricDetailsCardSection>(initialMetrics);
  const [loading, setLoading] = useState(false);

  console.log(daysData, "days");

  useEffect(() => {
    const extractStringValues = (obj) => {
      const stringValues = {};
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          stringValues[key] = obj[key];
        } else if (typeof obj[key] === "object") {
          const nestedStringValues = extractStringValues(obj[key]);
          if (Object.keys(nestedStringValues).length > 0) {
            stringValues[key] = nestedStringValues;
          }
        }
      }
      return stringValues;
    };

    const stringValues = extractStringValues(daysData);

    const extractValues = (str) => {
      const parts = str.split(",").map((part) => part.trim());
      const currentDayValue = parts[0];
      const baselinePercentage = parts[1];
      const previousDayValue = parts[2];
      const comparisonWithPreviousDay = parts[3];
      return {
        currentDayValue,
        baselinePercentage,
        previousDayValue,
        comparisonWithPreviousDay,
      };
    };

    const result = Object.entries(stringValues).map(([key, value]) => ({
      [key]: extractValues(value),
    }));
    setStructuredDetails(result);
  }, [daysData]);

  useEffect(() => {
    const mttdKey = `${String(aggregatorValue).toLowerCase()}MTTD`;
    const mttrKey = `${String(aggregatorValue).toLowerCase()}MTTR`;

    const mttdItem = structuredDetails.find(
      (item) => Object.keys(item)[0] === mttdKey
    );
    const mttrItem = structuredDetails.find(
      (item) => Object.keys(item)[0] === mttrKey
    );

    setMttdData(mttdItem ? mttdItem[mttdKey] : {});
    setMttrData(mttrItem ? mttrItem[mttrKey] : {});
  }, [aggregatorValue, structuredDetails]);

  console.log(mttdData, mttrData, structuredDetails, "------------------");

  return (
    <Flex flexDirection="column" width="100%">
      <Flex justifyContent="space-between">
        <FormField label="Select Aggregation">
          <SelectV2
            name="aggr-select"
            value={aggregatorValue}
            onChange={(e) => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
              }, 1000);
              setAggregatorValue(e);
            }}
          >
            <SelectV2.Trigger width="200px" />
            <SelectV2.Content>
              <SelectV2.Option value="min">Minimum</SelectV2.Option>
              <SelectV2.Option value="max">Maximum</SelectV2.Option>
              <SelectV2.Option value="median">Median</SelectV2.Option>
              <SelectV2.Option value="average">Average</SelectV2.Option>
            </SelectV2.Content>
          </SelectV2>
        </FormField>

        <FormField label="Select Timeframe">
          <SelectV2
            name="time-select"
            value={selectedTimeFrame}
            onChange={(e) => {
              setLoading(true);
              setSelectedTimeFrame(String(e));
              setTimeout(() => {
                setLoading(false);
              }, 3000);
            }}
          >
            <SelectV2.Trigger width="200px" />
            <SelectV2.Content>
              <SelectV2.Option value="2">Past 2 Days</SelectV2.Option>
              <SelectV2.Option value="7">Past 7 Days</SelectV2.Option>
              <SelectV2.Option value="30">Past 30 Days</SelectV2.Option>
            </SelectV2.Content>
          </SelectV2>
        </FormField>
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
                title={"Last 2 days (Minutes)"}
                value={mttdData.currentDayValue}
              />
              <InfoItem
                title={"2 days prior last 2 days (Minutes)"}
                value={mttdData.previousDayValue}
              />
              <InfoItem
                title={"Baseline comparison: past 2 days"}
                value={mttdData.baselinePercentage}
              />
              <InfoItem
                title={"Comparing Recent 2 Days with 2 Days Prior"}
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
                title={"2 days prior last 2 days (Minutes)"}
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
