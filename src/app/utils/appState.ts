import { stateClient } from "@dynatrace-sdk/client-state";

type AppStateTypes = {
  key: string;
  value: string;
  validUntilTime?: string | null | undefined;
};

export const getPersistedAppState = async (key: string) => {
  const { value } = await stateClient.getAppState({
    key,
  });

  const dataAfterParsing = JSON.parse(value);

  return dataAfterParsing;
};

export const setAppStatePersisted = async (args: AppStateTypes) => {
  const data = await stateClient.setAppState({
    key: args.key,
    body: { value: args.value },
  });

  return data;
};

export const deleteAllPersistedStates = async () => {
  return await stateClient.deleteAppStates();
};

export const getListofKeysUsedInApp = async () => {
  const appStateKeys: Array<{ key: string }> = await stateClient.getAppStates(
    {}
  );
  // console.log({ appStateKeys });
  return appStateKeys;
};
