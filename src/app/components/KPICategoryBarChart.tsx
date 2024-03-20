import { Heading } from "@dynatrace/strato-components-preview";
import {
  CategoricalBarChart,
  type CategoricalBarChartData,
} from "@dynatrace/strato-components-preview/charts";
import Colors from "@dynatrace/strato-design-tokens/colors";
import React from "react";
import type { RequiredDataResponse } from "types";

type Props = {
  data: RequiredDataResponse;
};

const KPICategoryBarChart: React.FC<Props> = (props) => {
  const {
    averageMTTDInMin,
    averageMTTRInMin,
    maxMTTDInMin,
    maxMTTRInMin,
    minMTTRInMin,
    minMTTDInMin,
    medianMTTRInMin,
    medianMTTDInMin,
    isLoading,
  } = props.data;

  const kpiData: CategoricalBarChartData[] = [
    {
      category: "Minumum",
      value: { MinMTTD: +minMTTDInMin, MinMTTR: +minMTTRInMin },
    },
    {
      category: "Maximum",
      value: { MaxMTTD: +maxMTTDInMin, MaxMTTR: +maxMTTRInMin },
    },
    {
      category: "Average",
      value: { AverageMTTD: +averageMTTDInMin, AverageMTTR: +averageMTTRInMin },
    },
    {
      category: "Median",
      value: { MedianMTTD: +medianMTTDInMin, MedianMTTR: +medianMTTRInMin },
    },
  ];
  return (
    <>
      <Heading>KPI Metrices With MTTD & MTTR Using Catergory Bar Chart</Heading>
      <CategoricalBarChart
        data={kpiData}
        groupMode="grouped"
        loading={isLoading}
      >
        <CategoricalBarChart.ValueAxis
          label="KPI With MTTD & MTTR"
          formatter={(value: number) => `${Math.round(value)} minutes`}
        />
        <CategoricalBarChart.Threshold
          data={{ min: 50, max: 245 }}
          color={Colors.Charts.Threshold.Bad.Default}
        />
        <CategoricalBarChart.Threshold
          data={{ min: 5, max: 40 }}
          color={Colors.Charts.Threshold.Good.Default}
        />
        <CategoricalBarChart.ErrorState>
          An error ocurred in the chart.
        </CategoricalBarChart.ErrorState>
      </CategoricalBarChart>
    </>
  );
};

export default KPICategoryBarChart;
