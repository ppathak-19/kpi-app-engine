import { useDqlQuery } from "@dynatrace-sdk/react-hooks";
import {
  DataTable,
  ProgressCircle,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps, TableDataType } from "types";
import { problemColumns } from "../constants/problemTableColumns";

export interface ResultRecordProps {
  event?: {
    id: string;
  };
}

const ProblemEvents: React.FC<AppCompProps> = () => {
  const initialQuery = `fetch events, from:now() - 30d | filter event.kind == "DAVIS_PROBLEM" | filter event.status == "CLOSED" | limit 50`;

  const [problemMttr, setProblemMttr] = useState<TableDataType[]>([]);

  const { data, isLoading } = useDqlQuery({
    body: { query: initialQuery },
  });

  console.log(data?.records, "query data");

  useEffect(() => {
    const getProblemsTableData = () => {
      if (!data) return;
      const problemRecords =
        data.records &&
        data.records.map((problem: ResultRecordProps | null) => {
          return {
            problemId: problem?.["event.id"],
            displayName: problem?.["event.name"],
            problemStartTime: problem?.["event.start"],
            problemEndTime: problem?.["event.end"],
            mttd: "-",
            mttr: "-",
          };
        });

      setProblemMttr(problemRecords);
    };

    console.log(new Date(1320000000000), "-");

    getProblemsTableData();
  }, [data]);

  return (
    <div>
      {isLoading ? (
        <ProgressCircle />
      ) : (
        <>
          <h3>MTTR for Problems</h3>
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
          />
        </>
      )}
    </div>
  );
};

export default ProblemEvents;
