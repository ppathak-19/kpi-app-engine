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

export const queryKPITableColumn: TableColumn[] = [
  {
    header: "Min",
    id: "min",
    columns: [
      {
        header: "Last 2 days",
        accessor: "min2Day",
      },
      {
        header: "Last 7 days",
        accessor: "min7Day",
      },
      {
        header: "Previous month",
        accessor: "minMonth",
      },
    ],
  },
  {
    header: "Max",
    id: "max",
    columns: [
      {
        header: "Last 2 days",
        accessor: "max2Day",
      },
      {
        header: "Last 7 days",
        accessor: "max7Day",
      },
      {
        header: "Previous month",
        accessor: "maxMonth",
      },
    ],
  },
  {
    header: "Average",
    id: "avg",
    columns: [
      {
        header: "Last 2 days",
        accessor: "avg2Day",
      },
      {
        header: "Last 7 days",
        accessor: "avg7Day",
      },
      {
        header: "Previous month",
        accessor: "avgMonth",
      },
    ],
  },
  {
    header: "Median",
    id: "median",
    columns: [
      {
        header: "Last 2 days",
        accessor: "med2Day",
      },
      {
        header: "Last 7 days",
        accessor: "med7Day",
      },
      {
        header: "Previous month",
        accessor: "medMonth",
      },
    ],
  },
];
