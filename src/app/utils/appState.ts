import { stateClient } from "@dynatrace-sdk/client-state";

type AppStateTypes = {
  key: string;
  value: string;
  validUntilTime?: string | null | undefined;
};

export const getPersistedUserAppState = async (key: string) => {
  const { value } = await stateClient.getUserAppState({
    key,
  });

  const dataAfterParsing = JSON.parse(value);

  return dataAfterParsing;
};

export const setUserAppStatePersisted = async (args: AppStateTypes) => {
  const data = await stateClient.setUserAppState({
    key: args.key,
    body: { value: args.value },
  });

  return data;
};

export const deleteAllUserAppPersistedStates = async () => {
  return await stateClient.deleteUserAppStates();
};

export const getListofUserAppKeysInApp = async () => {
  const appStateKeys: Array<{ key: string }> =
    await stateClient.getUserAppStates({});
  // console.log({ appStateKeys });
  return appStateKeys;
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

export const deleteAllAppPersistedStates = async () => {
  return await stateClient.deleteAppStates();
};

export const getListofAppKeysInApp = async () => {
  const appStateKeys: Array<{ key: string }> = await stateClient.getAppStates(
    {}
  );
  // console.log({ appStateKeys });
  return appStateKeys;
};
