import { type ResultRecord } from "@dynatrace-sdk/client-query";
import { convertUTCToDate, formatProblemTimeWithDiff } from "./timeConverters";
import type { IgnoreCasesType } from "types";

type processRecordsParameterType = {
  records: (ResultRecord | null)[];
  selectedEventCategory: string[] | undefined;
  ignore: IgnoreCasesType;
};

export const processRecords = ({
  records,
  selectedEventCategory,
  ignore,
}: processRecordsParameterType): (ResultRecord | null)[] => {
  const processedRecords: (ResultRecord | null)[] = [];

  records.forEach(eachR => {
    if (!eachR) return;

    // Check if the record's event category matches any category in selectedEventCategory
    if (
      selectedEventCategory &&
      selectedEventCategory.length > 0 &&
      !selectedEventCategory.includes(eachR?.["event.category"] as string)
    ) {
      return;
    }

    /** Here we are calculating the No.Of time Diff in minutes b/w event start and res.event start
     *
     * t0 -> res.event.start
     * t1 -> event.start
     * t2 -> event.end
     *
     */

    // Here we are calculating the No.Of time Diff in minutes b/w event start and res.event start
    const mttd = formatProblemTimeWithDiff(
      convertUTCToDate(eachR?.["event.start"] as string),
      convertUTCToDate(eachR?.["res.event.start"] as string)
    );

    // Here we are calculating the No.Of time Diff in minutes b/w event start & event end
    const mttr = formatProblemTimeWithDiff(
      convertUTCToDate(eachR?.["event.start"] as string),
      convertUTCToDate(eachR?.["event.end"] as string)
    );

    // Create a new object with existing properties and add mttdTime and mttrTime
    const processedRecord: ResultRecord = {
      ...eachR,
      mttdTime: mttd,
      mttrTime: mttr,
    };

    // Filter out records where mttr is less than or equal to 5 minutes
    if (Number(mttr) > ignore.shorterTime && Number(mttr) < ignore.longerTime) {
      processedRecords.push(processedRecord);
    }
  });

  return processedRecords;
};

/** This Function gives MeaningFull and Customized Errors instead of Using catched Errors */
export const giveMeaningFullErrorDetails = (err: string) => {
  // eslint-disable-next-line prefer-const
  let errorDetails = {
    code: 0,
    message: " ",
  };

  if (err === "Unauthorized" || "Error") {
    errorDetails = {
      code: 401,
      message: "You are UnAuthorized. Please Contact Your Admin",
    };
  } else if (err.includes("Jwt")) {
    errorDetails = {
      code: 401,
      message: "Your JWT Token has Expired. Please Try After Some Time",
    };
  } else {
    errorDetails = {
      code: 401,
      message: "Error Occurred, Please Try After Some Time",
    };
  }

  return errorDetails;
};
