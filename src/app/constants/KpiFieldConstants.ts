// This variables are used in tableColumns and useGetSummarizationData() hook, so that we will get the response from the hook with this below keys

import type {
  RequiredDataResponse,
  ResponseWithMetricesData,
  ResponseWithPercentages,
} from "types";

// if you are changing any value or adding new value, also make changes in `KPIaggregationTypes` types

/** For MTTD  */
export const medianMTTD = "medianMTTD";
export const maxMTTD = "maxMTTD";
export const averageMTTD = "averageMTTD";
export const minMTTD = "minMTTD";

/**  For MTTR */
export const averageMTTR = "averageMTTR";
export const medianMTTR = "medianMTTR";
export const maxMTTR = "maxMTTR";
export const minMTTR = "minMTTR";

/** RequiredResponseType */
export const emptyResponse: RequiredDataResponse = {
  isError: false,
  isLoading: true,
  responseInPercentageWithBaseline: {} as ResponseWithPercentages,
  responseInPercentageWithPreviousDay: {} as ResponseWithPercentages,
  responseWithCurrentDayData: {} as ResponseWithMetricesData,
  responseWithPreviousDayData: {} as ResponseWithMetricesData,
  timeSeriesWithCurrentDayData: { metadata: {}, records: [], types: [] },
};
