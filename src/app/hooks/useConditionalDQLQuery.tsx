import { QueryResult } from "@dynatrace-sdk/client-query";
import { useEffect, useState } from "react";
import { stateClient } from "@dynatrace-sdk/client-state";
import { monthNames } from "../constants/options";
import { queryType } from "types";

export const useCachedQueryData = (
  queryData1: queryType,
  selectedTimeFrame: string
) => {
  const currentDate = new Date();

  const currentMonth = monthNames[currentDate.getMonth()];

  const [cachedData1, setCachedData1] = useState<QueryResult | undefined>();
  // stateClient.deleteAppState({ key: "april" });
  useEffect(() => {
    const cacheQueryData = async () => {
      try {
        debugger;
        const appStateKeys = await stateClient.getAppStates({});
        const listOfAvailableKeys = appStateKeys.map((eachKey) => eachKey?.key);

        console.log(listOfAvailableKeys, "keys");

        if (!selectedTimeFrame || !listOfAvailableKeys.includes(currentMonth)) {
          return;
        }

        if (
          selectedTimeFrame === "365" &&
          listOfAvailableKeys.includes(currentMonth)
        ) {
          const storeCahceBytimeLine = await stateClient.getAppState({
            key: currentMonth,
          });

          console.log(
            JSON.parse(storeCahceBytimeLine.value),
            "dataaa-----------------"
          );
          setCachedData1(JSON.parse(storeCahceBytimeLine.value));
        } else {
          queryData1.refetch();
          debugger;

          if (queryData1.data && selectedTimeFrame === "365") {
            stateClient.setAppState({
              key: currentMonth,
              body: {
                value: JSON.stringify(queryData1.data),
                validUntilTime: "now+30d",
              },
            });
          }
        }
      } catch (error) {
        console.error("Error occurred while caching query data:", error);
      }
    };

    cacheQueryData();
  }, [stateClient, selectedTimeFrame, currentMonth]);

  return cachedData1 || queryData1;
};
