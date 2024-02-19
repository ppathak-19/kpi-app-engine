import { TableColumn } from "@dynatrace/strato-components-preview";

export const problemColumns: TableColumn[] = [
  {
    header: "Problem Details",
    id: "problemDetails",
    columns: [
      {
        header: "Display Name",
        accessor: "displayName",
      },
      {
        header: "Problem ID",
        accessor: "problemId",
      },
      {
        header: "Problem Start time",
        accessor: "problemStartTime",
      },
      {
        header: "Problem End time",
        accessor: "problemEndTime",
      },
    ],
  },
  {
    header: "KPI's",
    id: "kpi",
    columns: [
      {
        header: "MTTD (min)",
        accessor: "mttd",
      },
      {
        header: "MTTR (min)",
        accessor: "mttr",
      },
    ],
  },
];
