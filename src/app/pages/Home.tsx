import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  SimpleTable,
  useCurrentTheme,
} from "@dynatrace/strato-components-preview";
import Borders from "@dynatrace/strato-design-tokens/borders";
import BoxShadows from "@dynatrace/strato-design-tokens/box-shadows";
import Colors from "@dynatrace/strato-design-tokens/colors";
import { problemsClient } from "@dynatrace-sdk/client-classic-environment-v2";
import {
  convertUTCToTime,
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";

// const from = "now() - 80d";

// const EVENT_QUERY = `fetch events, from: ${from}`;

import styled from "styled-components";
import { problemColumns } from "../constants/problemTableColumns";

const StyledContainer = styled.div`
  outline: solid 1px black;
  outline-offset: 1px;
  width: 40%;
  height: 150px;
  margin-bottom: 16px;
`;

export const Home = () => {
  const theme = useCurrentTheme();
  const [storedMTTDforProblem, setStoredMTTDforProblem] = useState({
    displayName: "",
    evidenceType: "",
    problemStartTime: "",
    evidenceStartTime: "",
    mttd: "",
  });
  const [storedMTTDforProblemList, setStoredMTTDforProblemList] = useState([
    {
      displayName: "",
      evidenceType: "",
      problemStartTime: "",
      evidenceStartTime: "",
      mttd: "",
    },
  ]);

  // const resp = useDqlQuery({
  //   body: {
  //     query: EVENT_QUERY,
  //   },
  // });

  // useEffect(() => {
  //   console.log(resp, "query data");
  // }, []);

  useEffect(() => {
    const getProblemsData = async () => {
      const problemForEvidenceDetail = await problemsClient.getProblem({
        problemId: "-5862975053431500832_1707857880000V2",
      });

      const problemStartTime = convertUTCToDate(
        problemForEvidenceDetail.startTime
      );

      if (problemForEvidenceDetail.evidenceDetails) {
        const sortProblemEvidence =
          problemForEvidenceDetail.evidenceDetails.details.sort(
            (a, b) => a.startTime - b.startTime
          );

        const updatedProblemEvidenceArray = sortProblemEvidence?.map(
          (problem) => {
            const convertedTime = convertUTCToDate(problem.startTime);

            return {
              ...problem,
              startTime: convertedTime,
            };
          }
        );

        const getEvidenceList = updatedProblemEvidenceArray.map((problem) => {
          return {
            displayName: problem.displayName,
            evidenceType: problem.evidenceType,
            problemStartTime: convertUTCToTime(
              problemForEvidenceDetail.startTime
            ),
            evidenceStartTime: convertUTCToTime(problem.startTime.getTime()),
            mttd: formatProblemTimeWithDiff(
              problemStartTime,
              problem.startTime
            ),
          };
        });

        setStoredMTTDforProblemList(getEvidenceList);

        setStoredMTTDforProblem({
          displayName: updatedProblemEvidenceArray[0].displayName,
          evidenceType: updatedProblemEvidenceArray[0].evidenceType,
          problemStartTime: convertUTCToTime(
            problemForEvidenceDetail.startTime
          ),
          evidenceStartTime: convertUTCToTime(
            updatedProblemEvidenceArray[0].startTime.getTime()
          ),
          mttd: formatProblemTimeWithDiff(
            problemStartTime,
            updatedProblemEvidenceArray[0].startTime
          ),
        });
      }
    };

    getProblemsData();
  }, []);

  return (
    <>
      <Flex flexDirection="column" alignItems="center" padding={32}>
        <h1>KPI Metric Data</h1>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={24}
          style={{
            width: "55%",
            height: "210px",
            textAlign: "center",
            border: `${Colors.Border.Neutral.Default}`,
            borderRadius: `${Borders.Radius.Container.Default}`,
            background: `${Colors.Background.Surface.Default}`,
            boxShadow: `${BoxShadows.Surface.Raised.Rest}`,
          }}
        >
          <div>
            <Heading level={2}>MTTD for a problem</Heading>
            <SimpleTable
              columns={problemColumns}
              data={[storedMTTDforProblem]}
            />
          </div>
        </Flex>
      </Flex>

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap={24}
        style={{
          width: "100%",
          textAlign: "center",
          border: `${Colors.Border.Neutral.Default}`,
          borderRadius: `${Borders.Radius.Container.Default}`,
          background: `${Colors.Background.Surface.Default}`,
          boxShadow: `${BoxShadows.Surface.Raised.Rest}`,
        }}
      >
        <div>
          <Heading level={2}>MTTD for problems</Heading>

          <SimpleTable
            variant={{
              rowDensity: "comfortable",
              rowSeparation: "zebraStripes",
              verticalDividers: true,
            }}
            columns={problemColumns}
            data={storedMTTDforProblemList}
          />
        </div>

        <div>
          <Heading level={2}>MTTR for problems</Heading>

          <SimpleTable
            variant={{
              rowDensity: "comfortable",
              rowSeparation: "zebraStripes",
              verticalDividers: true,
            }}
            columns={problemColumns}
            data={storedMTTDforProblemList}
          />
        </div>
      </Flex>
    </>
  );
};
