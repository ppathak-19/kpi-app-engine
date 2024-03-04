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
    averageMTTDInNum,
    averageMTTRInNum,
    maxMTTDInNum,
    maxMTTRInNum,
    minMTTDInNum,
    minMTTRInNum,
    medianMTTDInNum,
    medianMTTRInNum,
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
            value={minMTTDInNum}
            name="Minimum MTTD"
          />
          <MultiMeterBarChart.Segment
            value={maxMTTDInNum}
            name="Maximum MTTD"
          />
          <MultiMeterBarChart.Segment
            value={averageMTTDInNum}
            name="Average MTTD"
          />
          <MultiMeterBarChart.Segment
            value={medianMTTDInNum}
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
            value={minMTTRInNum}
            name="Minimum MTTR"
          />
          <MultiMeterBarChart.Segment
            value={maxMTTRInNum}
            name="Maximum MTTR"
          />
          <MultiMeterBarChart.Segment
            value={averageMTTRInNum}
            name="Average MTTR"
          />
          <MultiMeterBarChart.Segment
            value={medianMTTRInNum}
            name="Median MTTR"
          />
          <MultiMeterBarChart.Legend />
        </MultiMeterBarChart>
      </StyledContainer>
    </>
  );
};

export default KPIMultiMeterComp;
