import { problemsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import {
  DataTable,
  ProgressCircle,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { type AppCompProps, type TableDataType } from "types";
import { problemColumns } from "../constants/problemTableColumns";
import { convertProbelmsData } from "../utils/convertProblemsData";

const Home: React.FC<AppCompProps> = () => {
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [tableDataForKPI, setTableDataForKPI] = useState<TableDataType[]>([]);

  useEffect(() => {
    const getListOfClosedProblems = async () => {
      await problemsClient
        .getProblems({
          from: "now-1m/w",
          problemSelector: "status(closed)",
        })
        .then((res) => {
          const dataPromises = res.problems.map(
            async (eachProblem) =>
              await convertProbelmsData(eachProblem.problemId)
          );

          Promise.all(dataPromises)
            .then((res) => {
              setTableDataForKPI(res);
              setDataLoaded(true);
            })
            .catch((err) => {
              setTableDataForKPI([]);
              setDataLoaded(true);
              console.error("Error in Fetching Data", err.message);
            });
        });
    };

    getListOfClosedProblems();
  }, []);

  return (
    <>
      {isDataLoaded ? (
        <DataTable
          columns={problemColumns}
          data={tableDataForKPI}
          sortable
          resizable
          fullWidth
          variant={{
            rowDensity: "comfortable",
            rowSeparation: "zebraStripes",
            verticalDividers: true,
          }}
        />
      ) : (
        <ProgressCircle />
      )}
    </>
  );
};

export default Home;
