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
  const extractStringValues = (obj) => {
    const stringValues = {};
    for (const key in obj) {
      if (typeof obj[key] === "string") {
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

  const stringValues = extractStringValues(daysData);

  const extractValues = (str) => {
    const parts = str.split(",").map((part) => part.trim());
    const currentDayValue = parts[0];
    const baselinePercentage = parts[1];
    const previousDayValue = parts[2];
    const comparisonWithPreviousDay = parts[3];
    return {
      currentDayValue,
      baselinePercentage,
      previousDayValue,
      comparisonWithPreviousDay,
    };
  };

  const structuredDetails: StructuredData = Object.entries(stringValues).map(
    ([key, value]) => ({
      [key]: extractValues(value),
    })
  );

  return [structuredDetails];
};
