import type { EvidenceArrayType, TableDataType } from "types";
import { getProblemDetails } from "./getProblemDetails";
import {
  convertMilliSecondsIntoDate,
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "./timeConverters";

export const convertProbelmsData = async (problemId: string) => {
  let updatedProblemEvidenceArray: EvidenceArrayType[], MTTR, MTTD;

  const problemDetails = await getProblemDetails(problemId);

  // console.log(problemDetails);

  const problemStartTime = convertUTCToDate(problemDetails.startTime);
  const problemEndTime = convertUTCToDate(problemDetails.endTime);

  if (!!problemDetails.evidenceDetails) {
    /** Sorting with the Oldest Event as first Object */
    const sortProblemEvidenceWithTime =
      problemDetails.evidenceDetails.details.sort(
        (a, b) => a.startTime - b.startTime
      );

    updatedProblemEvidenceArray = sortProblemEvidenceWithTime?.map(
      (problem) => {
        const convertedTime = convertUTCToDate(problem.startTime);

        return {
          ...problem,
          startTime: convertedTime,
        };
      }
    );

    /** To Find MTTD, we need start time from the first object in Evidence Array and Start time from Problem Details */

    MTTD = formatProblemTimeWithDiff(
      problemStartTime,
      updatedProblemEvidenceArray[0].startTime
    );

    // console.log("ProblemSt", problemStartTime);
    // console.log("ProblemEt", problemEndTime);
    // console.log("Evidence[0]", updatedProblemEvidenceArray[0].startTime);
    // console.log("MTTD", MTTD);

    /** To Find MTTR, we need Start Time from Problem Details and End Time from Problem Details */

    MTTR = formatProblemTimeWithDiff(problemStartTime, problemEndTime);
    // console.log(`\n`);
    // console.log("ProblemSt", problemStartTime);
    // console.log("ProblemEt", problemEndTime);
    // console.log("MTTR", MTTR);
  }

  const res: TableDataType = {
    problemId: problemDetails.problemId,
    displayName: problemDetails.displayId,
    problemStartTime: convertMilliSecondsIntoDate(problemDetails.startTime),
    problemEndTime: convertMilliSecondsIntoDate(problemDetails.endTime),
    // evidenceStartTime: updatedProblemEvidenceArray[0].startTime).toLocaleString(),
    mttd: MTTD,
    mttr: MTTR,
  };

  // console.log(res);

  return res;
};
