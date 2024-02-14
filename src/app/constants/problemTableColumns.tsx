import { SimpleTableColumn } from "@dynatrace/strato-components-preview";

export const problemColumns: SimpleTableColumn[] = [
  {
    header: "Display Name",
    accessor: "displayName",
  },
  {
    header: "Evidence Type",
    accessor: "evidenceType",
  },
  {
    header: "Problem Start time",
    accessor: "problemStartTime",
  },
  {
    header: "Evidence Start Time",
    accessor: "evidenceStartTime",
  },
  {
    header: "MTTD (HH:mm:ss)",
    accessor: "mttd",
  },
];
