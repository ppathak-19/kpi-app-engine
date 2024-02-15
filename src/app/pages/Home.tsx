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
import {
  problemColumns,
  problemColumnsMTTR,
} from "../constants/problemTableColumns";
import { mttdObject, mttrObject } from "../constants/kpis-placeholder";

// const from = "now() - 80d";

// const EVENT_QUERY = `fetch events, from: ${from}`;

export const Home = () => {
  const theme = useCurrentTheme();
  const [storedMTTDforProblem, setStoredMTTDforProblem] = useState(mttdObject);
  const [storedMTTRforProblem, setStoredMTTRforProblem] = useState(mttrObject);

  const [storedMTTDforProblemList, setStoredMTTDforProblemList] = useState([
    mttdObject,
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

      if (!problemForEvidenceDetail.evidenceDetails) return;

      const sortProblemEvidence =
        problemForEvidenceDetail.evidenceDetails.details.sort(
          (a, b) => a.startTime - b.startTime
        );

      setStoredMTTDforProblem({
        displayID: problemForEvidenceDetail.displayId,
        displayName: sortProblemEvidence[0].displayName,
        evidenceType: sortProblemEvidence[0].evidenceType,
        problemStartTime: convertUTCToTime(problemForEvidenceDetail.startTime),
        evidenceStartTime: convertUTCToTime(
          convertUTCToDate(sortProblemEvidence[0].startTime).getTime()
        ),
        mttd: formatProblemTimeWithDiff(
          problemStartTime,
          convertUTCToDate(sortProblemEvidence[0].startTime)
        ),
      });

      setStoredMTTRforProblem({
        displayID: problemForEvidenceDetail.displayId,
        displayName: sortProblemEvidence[0].displayName,
        evidenceType: sortProblemEvidence[0].evidenceType,
        problemStartTime: convertUTCToTime(problemForEvidenceDetail.startTime),
        problemEndTime: convertUTCToTime(
          convertUTCToDate(problemForEvidenceDetail.endTime).getTime()
        ),
        mttr: formatProblemTimeWithDiff(
          convertUTCToDate(sortProblemEvidence[0].startTime),
          convertUTCToDate(problemForEvidenceDetail.endTime)
        ),
      });
    };

    getProblemsData();
  }, []);

  return (
    <>
      <Flex flexDirection="column" alignItems="center" padding={32}>
        <h1>KPI Metric Data</h1>
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={24}
          style={{
            width: "100%",
            height: "210px",
            textAlign: "center",
            border: `${Colors.Border.Neutral.Default}`,
            borderRadius: `${Borders.Radius.Container.Default}`,
            background: `${Colors.Background.Surface.Default}`,
            boxShadow: `${BoxShadows.Surface.Raised.Rest}`,
          }}
        >
          <div>
            <Heading level={2}>MTTD for a problem evidence</Heading>
            <SimpleTable
              columns={problemColumns}
              data={[storedMTTDforProblem]}
            />
          </div>

          <div>
            <Heading level={2}>MTTR for a problem</Heading>
            <SimpleTable
              columns={problemColumnsMTTR}
              data={[storedMTTRforProblem]}
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

        {storedMTTDforProblemList.length > 0 ? (
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
        ) : (
          <h4>No Table data present</h4>
        )}
      </Flex>
    </>
  );
};
