import {
  DataTable,
  Surface,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import React from "react";
import type { TableDataType } from "types";
import { problemColumns } from "../constants/problemTableColumns";

type DataTableKpiProps = {
  data: TableDataType[];
};

const DataTableKpi: React.FC<DataTableKpiProps> = (props) => {
  const { data } = props;
  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>DataTable With Two KPI's</TitleBar.Title>
      </TitleBar>
      <br />
      <DataTable
        columns={problemColumns}
        data={data}
        sortable
        resizable
        fullWidth
        variant={{
          rowDensity: "comfortable",
          rowSeparation: "zebraStripes",
          verticalDividers: true,
        }}
      />
    </Surface>
  );
};

export default DataTableKpi;
