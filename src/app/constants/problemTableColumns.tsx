import { TableColumn } from "@dynatrace/strato-components-preview";

export const problemColumns: TableColumn[] = [
  {
    header: "Problem Details",
    id: "problemDetails",
    columns: [
      {
        header: "Display Name",
        accessor: "displayName",
        autoWidth: true,
      },
      {
        header: "Problem ID",
        accessor: "problemId",
        autoWidth: true,
      },
      {
        header: "Problem Start time",
        accessor: "problemStartTime",
        autoWidth: true,
      },
      {
        header: "Problem End time",
        accessor: "problemEndTime",
        autoWidth: true,
      },
    ],
  },
  {
    header: "KPI's",
    id: "kpi",
    columns: [
      {
        header: "MTTD (HH:mm:ss)",
        accessor: "mttd",
        autoWidth: true,
      },
      {
        header: "MTTR (HH:mm:ss)",
        accessor: "mttr",
        autoWidth: true,
      },
    ],
  },
];
