import { stateClient } from "@dynatrace-sdk/client-state";

type AppStateTypes = {
  key: string;
  value: string;
  validUntilTime?: string | null | undefined;
};

export const getAppState = async (key: string) => {
  const { value } = await stateClient.getAppState({
    key,
  });

  const dataAfterParsing = JSON.parse(value);

  return dataAfterParsing;
};

export const setAppState = async (args: AppStateTypes) => {
  const data = await stateClient.setAppState({
    key: args.key,
    body: { value: args.value, validUntilTime: "now+5m" },
  });

  return data;
};
