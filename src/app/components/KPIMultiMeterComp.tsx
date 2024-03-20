import { MultiMeterBarChart } from "@dynatrace/strato-components-preview/charts";
import { Heading } from "@dynatrace/strato-components-preview/typography";
import React from "react";
import styled from "styled-components";
import type { RequiredDataResponse } from "types";

const StyledContainer = styled.div`
  width: 600px;
  height: 180px;
`;

type KPIMultiMeterCompProps = {
  data: RequiredDataResponse;
};

const KPIMultiMeterComp: React.FC<KPIMultiMeterCompProps> = (props) => {
  const {
    averageMTTDInMin,
    averageMTTRInMin,
    maxMTTDInMin,
    maxMTTRInMin,
    minMTTRInMin,
    minMTTDInMin,
    medianMTTRInMin,
    medianMTTDInMin,
    // isLoading,
  } = props.data;
  return (
    <>
      <Heading>
        KPI Metrices With MTTD & MTTR Using Multi Meter Bar Chart
      </Heading>
      <br />
      <StyledContainer>
        <MultiMeterBarChart
          formatter={(value: number) => `${Math.round(value)} minutes`}
        >
          <MultiMeterBarChart.Label>MTTD Metrices</MultiMeterBarChart.Label>
          <MultiMeterBarChart.Tooltip />
          <MultiMeterBarChart.Segment
            value={minMTTDInMin}
            name="Minimum MTTD"
          />
          <MultiMeterBarChart.Segment
            value={maxMTTDInMin}
            name="Maximum MTTD"
          />
          <MultiMeterBarChart.Segment
            value={averageMTTDInMin}
            name="Average MTTD"
          />
          <MultiMeterBarChart.Segment
            value={medianMTTDInMin}
            name="Median MTTD"
          />
          <MultiMeterBarChart.Legend />
        </MultiMeterBarChart>
      </StyledContainer>
      <StyledContainer>
        <MultiMeterBarChart
          formatter={(value: number) => `${Math.round(value)} minutes`}
        >
          <MultiMeterBarChart.Label>MTTR Metrices</MultiMeterBarChart.Label>
          <MultiMeterBarChart.Tooltip />
          <MultiMeterBarChart.Segment
            value={minMTTRInMin}
            name="Minimum MTTR"
          />
          <MultiMeterBarChart.Segment
            value={maxMTTRInMin}
            name="Maximum MTTR"
          />
          <MultiMeterBarChart.Segment
            value={averageMTTRInMin}
            name="Average MTTR"
          />
          <MultiMeterBarChart.Segment
            value={medianMTTRInMin}
            name="Median MTTR"
          />
          <MultiMeterBarChart.Legend />
        </MultiMeterBarChart>
      </StyledContainer>
    </>
  );
};

export default KPIMultiMeterComp;
