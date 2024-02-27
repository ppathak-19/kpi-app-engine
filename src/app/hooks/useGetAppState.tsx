import { useEffect, useState } from "react";
import { stateClient } from "@dynatrace-sdk/client-state";

type GetAppStatehookProps = {
  key: string;
};

const useGetAppState = (props: GetAppStatehookProps) => {
  const { key } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<unknown>();

  useEffect(() => {
    const getAppStateData = async () => {
      const { value } = await stateClient.getAppState({
        key,
      });
      const stateAfterParsing = JSON.parse(value);
      return stateAfterParsing;
    };
    setIsLoading(true);
    getAppStateData()
      .then((data) => {
        setIsLoading(false);
        setData(data);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [key]);

  return { isLoading, error, data };
};

export default useGetAppState;
