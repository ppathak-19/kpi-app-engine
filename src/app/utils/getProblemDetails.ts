import { problemsClient } from "@dynatrace-sdk/client-classic-environment-v2";

export const getProblemDetails = async (problemId: string) => {
  const res = await problemsClient.getProblem({
    problemId,
  });
  return res;
};
