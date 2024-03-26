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
  const result =
    records &&
    records.filter((eachR) => {
      if (!eachR) return false;

      // Check if the record's event category matches any category in selectedEventCategory
      if (
        selectedEventCategory &&
        selectedEventCategory.length > 0 &&
        !selectedEventCategory.includes(eachR?.["event.category"] as string)
      ) {
        return false;
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

      // Add mttdTime and mttrTime to each record
      eachR.mttdTime = mttd;
      eachR.mttrTime = mttr;

      // Filter out records where mttr is less than or equal to 5 minutes
      return (
        Number(mttr) > ignore.shorterTime && Number(mttr) < ignore.longerTime
      );
    });

  return !!result ? result : [];
};
