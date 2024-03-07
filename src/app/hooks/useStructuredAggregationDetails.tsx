import { RequiredDataResponse } from "types";

type StructuredDetail = {
  currentDayValue: string;
  baselinePercentage: string;
  previousDayValue: string;
  comparisonWithPreviousDay: string;
};

type StructuredData = Array<{
  [key: string]: StructuredDetail;
}>;

// seperates the aggregation with its (Structured Details)
export const useStructuredAggregationDetails = (
  daysData: RequiredDataResponse
) => {
  console.log(daysData, "days");
  const extractStringValues = (obj) => {
    const stringValues = {};
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        stringValues[key] = obj[key];
      } else if (typeof obj[key] === "number") {
        stringValues[key] = obj[key];
      } else if (typeof obj[key] === "object") {
        const nestedStringValues = extractStringValues(obj[key]);
        if (Object.keys(nestedStringValues).length > 0) {
          stringValues[key] = nestedStringValues;
        }
      }
    }
    return stringValues;
  };

  const stringValues1 = Array(extractStringValues(daysData));

  console.log(stringValues1, "values");

  return [stringValues1];
};
