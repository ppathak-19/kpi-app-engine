import { units } from "@dynatrace-sdk/units";
import { SingleValueGrid } from "@dynatrace/strato-components-preview/charts";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React from "react";
import styled from "styled-components";
import type { RequiredDataResponse } from "types";

type KPISingleValueCompProps = {
  data: RequiredDataResponse;
};

const StyledContainer = styled.div`
  outline: solid 1px black;
  outline-offset: 1px;
  width: 100%;
  height: 550px;
  margin-bottom: 16px;
`;

const KPISingleValueComp: React.FC<KPISingleValueCompProps> = (props) => {
  const {
    maxMTTDInNum,
    minMTTDInNum,
    averageMTTDInNum,
    medianMTTDInNum,
    maxMTTRInNum,
    minMTTRInNum,
    averageMTTRInNum,
    medianMTTRInNum,
    responseInPercentageWithPreviousDay,
  } = props.data;

  console.log(props.data);

  const giveTrendData = (val: number) => {
    if (val === 0) {
      return "neutral";
    } else if (val >= 1) {
      return "upward";
    } else if (val < 0) {
      return "downward";
    }
  };

  const kpiData = [
    {
      data: !!maxMTTDInNum ? maxMTTDInNum : 0,
      label: "Maximum MTTD",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.maxMTTD),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.maxMTTD
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!minMTTDInNum ? minMTTDInNum : 0,
      label: "Minimum MTTD",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.minMTTD),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.minMTTD
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!averageMTTDInNum ? averageMTTDInNum : 0,
      label: "Average MTTD",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.averageMTTD),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.averageMTTD
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!medianMTTDInNum ? medianMTTDInNum : 0,
      label: "Median MTTD",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.medianMTTD),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.medianMTTD
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!maxMTTRInNum ? maxMTTRInNum : 0,
      label: "Maximum MTTR",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.maxMTTR),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.maxMTTR
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!minMTTRInNum ? minMTTRInNum : 0,
      label: "Minimum MTTR",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.minMTTR),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.minMTTR
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!averageMTTRInNum ? averageMTTRInNum : 0,
      label: "Average MTTR",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.averageMTTR),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.averageMTTR
          : 0,
        label: "Last 24 hours",
      },
    },
    {
      data: !!medianMTTRInNum ? medianMTTRInNum : 0,
      label: "Median MTTR",
      unit: "mins",
      trend: {
        direction:
          !!responseInPercentageWithPreviousDay &&
          giveTrendData(responseInPercentageWithPreviousDay.medianMTTR),
        value: !!responseInPercentageWithPreviousDay
          ? responseInPercentageWithPreviousDay.medianMTTR
          : 0,
        label: "Last 24 hours",
      },
    },
  ];

  const valueColor = Colors.Charts.CategoricalThemed.PurpleRain.Color02.Default;
  return (
    <StyledContainer>
      <SingleValueGrid
        data={kpiData}
        alignment={"center"}
        color={valueColor}
        labelAccessor={"label"}
      >
        <SingleValueGrid.Value
          dataAccessor={"data"}
          formatter={{
            // input: units.amount.mole,
            maximumFractionDigits: 2,
          }}
          formatterAccessor={"formatter"}
          unitAccessor={"unit"}
        ></SingleValueGrid.Value>
        <SingleValueGrid.Trend
          directionAccessor={"trend.direction"}
          valueAccessor={"trend.value"}
          labelAccessor={"trend.label"}
          formatter={{
            input: units.percentage.percent,
            output: units.percentage.percent,
          }}
          formatterAccessor={"trend.formatter"}
        ></SingleValueGrid.Trend>
      </SingleValueGrid>
    </StyledContainer>
  );
};

export default KPISingleValueComp;
