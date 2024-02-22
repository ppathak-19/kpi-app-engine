import {
  Surface,
  TimeseriesChart,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import type { Timeseries } from "@dynatrace/strato-components-preview/charts";
import React from "react";
import type { TableDataType } from "types";

type LineTimeSeriesProps = {
  data: TableDataType[];
};

const LineTimeSeries: React.FC<LineTimeSeriesProps> = (props) => {
  const { data } = props;

  /** Converting the tableData into the timeseries required data */
  const convertTableDataIntoTimeSeriesData = (
    data: TableDataType[]
  ): Timeseries[] =>
    data.map((eachData) => {
      const start = new Date(eachData.problemStartTime);
      const end = new Date(eachData.problemEndTime);

      return {
        name: eachData.displayName,
        datapoints: [{ start, end, value: +eachData.mttd }],
      };
    });

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>TimeSeries - Line With Two KPI's</TitleBar.Title>
      </TitleBar>
      <br />
      <TimeseriesChart
        data={convertTableDataIntoTimeSeriesData(data)}
        variant="line"
      />
    </Surface>
  );
};

export default LineTimeSeries;
