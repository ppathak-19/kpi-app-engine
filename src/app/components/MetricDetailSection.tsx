import {
  Container,
  Flex,
  FormField,
  Heading,
  SelectV2,
  Strong,
} from "@dynatrace/strato-components-preview";
import React, { useState } from "react";

const InfoItem = ({ title, value }) => {
  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <p>{title}</p>
      <hr
        style={{
          margin: "0 1rem",
          flex: 1,
          border: "none",
          height: "1px",
          backgroundColor: "#d5d5e1",
        }}
      />
      <Strong>{value}</Strong>
    </Flex>
  );
};

export const MetricDetailSection = () => {
  const [singleValue, setSingleValue] = useState<string | null>("median");

  return (
    <Flex flexDirection="column" width="100%">
      <FormField label="Select Aggregation">
        <SelectV2
          name="aggr-select"
          value={singleValue}
          onChange={setSingleValue}
        >
          <SelectV2.Trigger width="200px" />
          <SelectV2.Content>
            <SelectV2.Option value="min">Minimum</SelectV2.Option>
            <SelectV2.Option value="max">Maximum</SelectV2.Option>
            <SelectV2.Option value="median">Median</SelectV2.Option>
            <SelectV2.Option value="avg">Average</SelectV2.Option>
          </SelectV2.Content>
        </SelectV2>
      </FormField>

      {/* Sections  */}

      <Flex flexDirection="row" width="100%">
        <Container variant="minimal" width="50%">
          <Heading level={5} as="h3">
            MTTD
          </Heading>
          <div style={{ margin: "1rem" }}>
            <InfoItem title={"Last 2 days (Minutes)"} value={"5 Min"} />
            <InfoItem
              title={"2 days prior last 2 days (Minutes)"}
              value={"5 Min"}
            />
            <InfoItem
              title={"Baseline comparison: past 2 days"}
              value={"95%"}
            />
            <InfoItem
              title={"Comparing Recent 2 Days with 2 Days Prior"}
              value={"-1"}
            />
          </div>
        </Container>

        <Container variant="minimal" width="50%">
          <Heading level={5} as="h3">
            MTTR
          </Heading>
          <div style={{ margin: "1rem" }}>
            <InfoItem title={"Last 2 days (Minutes)"} value={"5 Min"} />
            <InfoItem
              title={"2 days prior last 2 days (Minutes)"}
              value={"5 Min"}
            />
            <InfoItem
              title={"Baseline comparison: past 2 days"}
              value={"95%"}
            />
            <InfoItem
              title={"Comparing Recent 2 Days with 2 Days Prior"}
              value={"-1"}
            />
          </div>
        </Container>
      </Flex>
    </Flex>
  );
};
