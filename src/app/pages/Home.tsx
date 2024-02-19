import { problemsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import {
  Container,
  ProgressCircle,
  ToggleButtonGroup,
  ToggleButtonGroupItem,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps, TableDataType } from "types";
import DataTableKpi from "../components/DataTableKpi";
import LineTimeSeries from "../components/LineTimeSeries";
import { convertProbelmsData } from "../utils/convertProblemsData";

const Home: React.FC<AppCompProps> = () => {
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [tableDataForKPI, setTableDataForKPI] = useState<TableDataType[]>([]);
  const [clickedBtn, setClickedBtn] = useState("line");

  useEffect(() => {
    const getListOfClosedProblems = async () => {
      await problemsClient
        .getProblems({
          from: "now-1y/w",
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
    <Container>
      <ToggleButtonGroup value={clickedBtn} onChange={setClickedBtn}>
        <ToggleButtonGroupItem value="dataTable">
          Data Table
        </ToggleButtonGroupItem>
        <ToggleButtonGroupItem value="line">Line Series</ToggleButtonGroupItem>
      </ToggleButtonGroup>

      <br />
      <br />
      <br />
      {isDataLoaded ? (
        <>
          {clickedBtn === "dataTable" && (
            <DataTableKpi data={tableDataForKPI} />
          )}
          {clickedBtn === "line" && <LineTimeSeries data={tableDataForKPI} />}
        </>
      ) : (
        <ProgressCircle />
      )}
    </Container>
  );
};

export default Home;
