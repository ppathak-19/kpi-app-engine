import { DataTable } from "@dynatrace/strato-components-preview/tables";
import React from "react";
import { queryKPITableColumnV2 } from "../constants/problemTableColumns";
import type { RequiredDataResponse } from "types";

type KPIDataTableV2Props = {
  loading: boolean;
  data: RequiredDataResponse[];
};

const KPIDataTableV2: React.FC<KPIDataTableV2Props> = (props) => {
  const { loading, data } = props;
  return (
    <DataTable
      resizable
      fullWidth
      columns={queryKPITableColumnV2}
      loading={loading}
      data={data}
      variant={{
        rowDensity: "comfortable",
        rowSeparation: "zebraStripes",
        verticalDividers: true,
      }}
    />
  );
};

export default KPIDataTableV2;
