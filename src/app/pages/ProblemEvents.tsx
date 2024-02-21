import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import {
  DataTable,
  Flex,
  Heading,
  Paragraph,
  ProgressCircle,
  SimpleTable,
  SimpleTableColumn,
  TableColumn,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps, TableDataType } from "types";
import { problemColumns } from "../constants/problemTableColumns";
import {
  convertUTCToDate,
  convertUTCToTime,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";

export interface ResultRecordProps {
  event?: {
    id: string;
  };
}

export const ProblemEvents = () => {
  const initialQuery = `fetch events, from: now() - 30d
  | filter event.kind == "DAVIS_PROBLEM" and event.status == "CLOSED" and event.status_transition == "CLOSED"
  | expand dt.davis.event_ids
   
  | fieldsAdd res = lookup([
      fetch events, from: now() - 30d
      | filter event.kind == "DAVIS_EVENT"
      | fields event.id, event.kind, event.start, event.end]
  , sourceField: dt.davis.event_ids, lookupField: event.id) 
  | fieldsFlatten res
  | sort res.event.start asc 
  | dedup event.id`;

  const [problemMttr, setProblemMttr] = useState<TableDataType[]>([]);

  const { data, isLoading } = useDqlQuery({
    body: { query: initialQuery },
  });

  console.log(data?.records, "query data");

  function convertMsToTime(timestamp) {
    const milliseconds = timestamp % 1000;
    const seconds = Math.floor(timestamp / 1000) % 60;
    const minutes = Math.floor(timestamp / (1000 * 60)) % 60;
    const hours = Math.floor(timestamp / (1000 * 60 * 60));

    return `${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`;
  }

  useEffect(() => {
    const getProblemsTableData = () => {
      if (!data) return;

      const minutes = Math.floor(
        Number(data?.records[0]?.["resolved_problem_duration"]) / (1000 * 60)
      );
      const minuteValue = minutes / 60;
      console.log(
        data?.records[0],
        minutes,
        convertMsToTime(
          Number(data?.records[0]?.["resolved_problem_duration"])
        ),

        convertUTCToTime(
          Number(data?.records[0]?.["resolved_problem_duration"]) * 1000
        )
      );
      const problemRecords =
        data.records &&
        data.records.map((problem: ResultRecordProps | null) => {
          return {
            problemId: problem?.["event.id"],
            displayName: problem?.["event.name"],
            problemStartTime: problem?.["event.start"],
            problemEndTime: problem?.["event.end"],
            mttd: String(
              formatProblemTimeWithDiff(
                convertUTCToDate(problem?.["event.start"]),
                convertUTCToDate(problem?.["res.event.start"])
              )
            ),
            mttr: convertUTCToTime(
              Number(problem?.["resolved_problem_duration"] * 1000)
            ),
          };
        });

      setProblemMttr(problemRecords);
    };

    console.log(new Date(1320000000000), "-");

    getProblemsTableData();
  }, [data]);

  const sampleColumns: TableColumn[] = [
    {
      header: "Min",
      id: "min",
      columns: [
        {
          header: "last 2 days",
          accessor: "2day",
        },
        {
          header: "weekly",
          accessor: "weeday",
        },
        {
          header: "monthly",
          accessor: "mday",
        },
      ],
    },
    {
      header: "Max",
      id: "max",
      columns: [
        {
          header: "last 2 days",
          accessor: "max2day",
        },
        {
          header: "weekly",
          accessor: "maxweekday",
        },
        {
          header: "monthly",
          accessor: "maxmday",
        },
      ],
    },
    {
      header: "Average",
      id: "avg",
      columns: [
        {
          header: "last 2 days",
          accessor: "avg2day",
        },
        {
          header: "weekly",
          accessor: "avgweekly",
        },
        {
          header: "monthly",
          accessor: "avgmontly",
        },
      ],
    },
    {
      header: "Median",
      id: "median",
      columns: [
        {
          header: "last 2 days",
          accessor: "me2day",
        },
        {
          header: "weekly",
          accessor: "meweekly",
        },
        {
          header: "monthly",
          accessor: "memonth",
        },
      ],
    },
  ];

  const sampleData = [
    {
      min: "et-demo-2-win4",
      max: "213.4",
      avg: 5830000000,
      median: "2022-09-26T12:45:07Z",
    },
    {
      min: "et-demo-2-win4",
      max: "213.4",
      avg: 5830000000,
      median: "2022-09-26T12:45:07Z",
    },
  ];

  return (
    <div>
      {isLoading ? (
        <ProgressCircle />
      ) : (
        <>
          <h3>KPI for Problems</h3>
          <DataTable
            columns={problemColumns}
            data={problemMttr}
            sortable
            resizable
            fullWidth
            variant={{
              rowDensity: "comfortable",
              rowSeparation: "zebraStripes",
              verticalDividers: true,
            }}
          >
            <DataTable.ExpandableRow>
              {({ row }) => {
                return (
                  <Flex flexDirection="column">
                    <Heading level={2}>MTTD</Heading>
                    <DataTable
                      resizable
                      fullWidth
                      columns={sampleColumns}
                      data={[]}
                    />
                  </Flex>
                );
              }}
            </DataTable.ExpandableRow>
          </DataTable>
        </>
      )}
    </div>
  );
};

export default ProblemEvents;
