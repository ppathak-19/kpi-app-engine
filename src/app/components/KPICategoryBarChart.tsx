import { Grid, Heading } from "@dynatrace/strato-components-preview";
import {
  CategoricalBarChart,
  type CategoricalBarChartData,
} from "@dynatrace/strato-components-preview/charts";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React from "react";
import type { RequiredDataResponse } from "types";
import { useMetricsContext } from "../hooks/context/MetricsContext";
import { convertKpiQueryMin_to_Time } from "../utils/timeConverters";

type Props = {
  data: RequiredDataResponse;
};

const KPICategoryBarChart: React.FC<Props> = (props) => {
  const {
    minMTTDInNum,
    minMTTRInNum,
    maxMTTDInNum,
    maxMTTRInNum,
    averageMTTDInNum,
    averageMTTRInNum,
    medianMTTDInNum,
    medianMTTRInNum,
    responseInPercentageWithBaseline,
    responseInPercentageWithPreviousDay,
    isLoading,
  } = props.data;

  // console.log(props.data);

  const { initialMttdValue, initialMttrValue } = useMetricsContext();

  const kpiData: CategoricalBarChartData[] = [
    {
      category: "Minumum",
      value: { MinMTTD: +minMTTDInNum, MinMTTR: +minMTTRInNum },
    },
    {
      category: "Maximum",
      value: { MaxMTTD: +maxMTTDInNum, MaxMTTR: +maxMTTRInNum },
    },
    {
      category: "Average",
      value: { AverageMTTD: +averageMTTDInNum, AverageMTTR: +averageMTTRInNum },
    },
    {
      category: "Median",
      value: { MedianMTTD: +medianMTTDInNum, MedianMTTR: +medianMTTRInNum },
    },
  ];

  const mttdData: CategoricalBarChartData[] = [
    {
      category: "Minimum",
      value: {
        CurrentMetric: minMTTDInNum || 0,
        ComparisonWithBaseline: responseInPercentageWithBaseline.minMTTD || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.minMTTD || 0,
      },
    },
    {
      category: "Maximum",
      value: {
        CurrentMetric: maxMTTDInNum || 0,
        ComparisonWithBaseline: responseInPercentageWithBaseline.maxMTTD || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.maxMTTD || 0,
      },
    },
    {
      category: "Average",
      value: {
        CurrentMetric: averageMTTDInNum || 0,
        ComparisonWithBaseline:
          responseInPercentageWithBaseline.averageMTTD || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.averageMTTD || 0,
      },
    },
    {
      category: "Median",
      value: {
        CurrentMetric: medianMTTDInNum || 0,
        ComparisonWithBaseline:
          responseInPercentageWithBaseline.medianMTTD || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.medianMTTD || 0,
      },
    },
  ];

  const mttrData: CategoricalBarChartData[] = [
    {
      category: "Minimum",
      value: {
        CurrentMetric: minMTTRInNum || 0,
        ComparisonWithBaseline: responseInPercentageWithBaseline.minMTTR || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.minMTTR || 0,
      },
    },
    {
      category: "Maximum",
      value: {
        CurrentMetric: maxMTTRInNum || 0,
        ComparisonWithBaseline: responseInPercentageWithBaseline.maxMTTR || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.maxMTTR || 0,
      },
    },
    {
      category: "Average",
      value: {
        CurrentMetric: averageMTTRInNum || 0,
        ComparisonWithBaseline:
          responseInPercentageWithBaseline.averageMTTR || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.averageMTTR || 0,
      },
    },
    {
      category: "Median",
      value: {
        CurrentMetric: medianMTTRInNum || 0,
        ComparisonWithBaseline:
          responseInPercentageWithBaseline.medianMTTR || 0,
        ComparisonWithPreviousDate:
          responseInPercentageWithPreviousDay.medianMTTR || 0,
      },
    },
  ];

  return (
    <>
      <Grid>
        <Heading level={6}>KPI Metrices Data in Single Chart</Heading>
        <CategoricalBarChart
          data={!!kpiData ? kpiData : []}
          groupMode="grouped"
          loading={isLoading}
        >
          <CategoricalBarChart.ValueAxis
            label="KPI With MTTD & MTTR"
            formatter={(value: number) =>
              `${convertKpiQueryMin_to_Time(value)}`
            }
          />
          <CategoricalBarChart.Threshold
            color={Colors.Charts.Threshold.Good.Default}
            data={{ min: 0, max: initialMttdValue }}
          />
          <CategoricalBarChart.Threshold
            data={{ min: initialMttdValue, max: initialMttrValue }}
            color={Colors.Charts.Threshold.Bad.Default}
          />
        </CategoricalBarChart>
      </Grid>
      <br />
      <Grid gridTemplateColumns={"repeat(2,1fr)"}>
        {/* Grid For MTTD Chart */}
        <Grid>
          <Heading level={6}>MTTD Chart</Heading>
          <CategoricalBarChart
            data={mttdData}
            groupMode="grouped"
            loading={isLoading}
            colorPalette="categorical"
            colorPaletteMode="multi-color"
          >
            <CategoricalBarChart.Threshold
              color={Colors.Charts.Threshold.Bad.Default}
              data={{ value: initialMttdValue }}
            />
            <CategoricalBarChart.Threshold
              color={Colors.Charts.Threshold.Bad.Default}
              data={{ value: initialMttrValue }}
            />
            <CategoricalBarChart.Legend position="bottom" />
          </CategoricalBarChart>
        </Grid>

        {/* Grid For MTTR Chart */}
        <Grid>
          <Heading level={6}>MTTR Chart</Heading>
          <CategoricalBarChart
            data={mttrData}
            groupMode="grouped"
            loading={isLoading}
            colorPalette="categorical"
            colorPaletteMode="multi-color"
          >
            <CategoricalBarChart.Threshold
              color={Colors.Charts.Threshold.Bad.Default}
              data={{ value: initialMttdValue }}
            />
            <CategoricalBarChart.Threshold
              color={Colors.Charts.Threshold.Bad.Default}
              data={{ value: initialMttrValue }}
            />
            <CategoricalBarChart.Legend position="bottom" />
          </CategoricalBarChart>
        </Grid>
      </Grid>
    </>
  );
};

export default KPICategoryBarChart;
