import {
  Flex,
  Heading,
  ProgressCircle,
  Timeframe,
  TimeframeSelector,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import { TableDataType, type AppCompProps } from "types";
import { problemsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import { convertProbelmsData } from "../utils/convertProblemsData";

import { SingleValue } from "@dynatrace/strato-components-preview/charts";
import styled from "styled-components";

const StyledContainer = styled.div`
  outline: solid 1px black;
  outline-offset: 1px;
  min-width: 4vw;
  min-height: 44px;
  width: 600px;
  height: 200px;
  padding: 14px;
`;

const Data: React.FC<AppCompProps> = () => {
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [problemsListData, setProblemsListData] = useState<TableDataType[]>([]);
  const [value, setValue] = useState<Timeframe | null>({
    from: "now-7d",
    to: "now",
  });

  useEffect(() => {
    const getListOfClosedProblems = async () => {
      await problemsClient
        .getProblems({
          from: value?.from,
          problemSelector: "status(closed)",
        })
        .then((res) => {
          const dataPromises = res.problems.map(
            async (eachProblem) =>
              await convertProbelmsData(eachProblem.problemId)
          );

          Promise.all(dataPromises)
            .then((res) => {
              console.log(res, "response");
              setProblemsListData(res);
              setDataLoaded(true);
            })
            .catch((err) => {
              setDataLoaded(true);
              console.error("Error in Fetching Data", err.message);
            });
        });
    };

    getListOfClosedProblems();
  }, [value]);

  function timeStringToMinutes(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  const totalMTTDMinutes = problemsListData.reduce((total, obj) => {
    const mttdMinutes = timeStringToMinutes(obj.mttd);
    return total + mttdMinutes;
  }, 0);

  const totalMTTRMinutes = problemsListData.reduce((total, obj) => {
    const mttdMinutes = timeStringToMinutes(obj.mttr);
    return total + mttdMinutes;
  }, 0);

  console.log(totalMTTDMinutes, "total in min");
  console.log(totalMTTDMinutes / problemsListData.length, "calculated MTTd");

  return (
    <>
      {isDataLoaded ? (
        <>
          <Flex flexDirection="column" alignItems="center" padding={32}>
            <Heading level={2}>Visualiztions for MTTD and MTTR</Heading>
            <div>
              <TimeframeSelector value={value} onChange={setValue} />
            </div>
          </Flex>
          <Flex flexDirection="column" padding={32}>
            <Flex alignItems="center" padding={32}>
              <div>
                <h3>
                  {" "}
                  {totalMTTDMinutes === 0
                    ? "Sorry try another timeframe"
                    : `Total detection time : ${totalMTTDMinutes}min`}
                </h3>
                <h3>Total number of problems : {problemsListData.length}</h3>
              </div>
              <StyledContainer>
                <SingleValue
                  data={`MTTD : ${
                    totalMTTDMinutes > 0
                      ? totalMTTDMinutes / problemsListData.length
                      : 0
                  }min`}
                />
              </StyledContainer>
            </Flex>

            <Flex alignItems="center" padding={32}>
              <div>
                <h3>
                  {" "}
                  {totalMTTRMinutes === 0
                    ? "Sorry try another timeframe"
                    : `Total detection time : ${totalMTTRMinutes}min`}
                </h3>
                <h3>Total number of problems : {problemsListData.length}</h3>
              </div>
              <StyledContainer>
                <SingleValue
                  data={`MTTR : ${
                    totalMTTRMinutes > 0
                      ? totalMTTRMinutes / problemsListData.length
                      : 0
                  }min`}
                />
              </StyledContainer>
            </Flex>
          </Flex>
        </>
      ) : (
        <ProgressCircle />
      )}
    </>
  );
};

export default Data;
