import {
  Flex,
  Surface,
} from "@dynatrace/strato-components-preview/layouts-core";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import { Text } from "@dynatrace/strato-components-preview/typography";
import { WarningIcon } from "@dynatrace/strato-icons";
import React from "react";
import QueryKpi from "./QueryKpi";
import { useMetricsContext } from "../hooks/context/MetricsContext";

type HomeCompProps = {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Home: React.FC<HomeCompProps> = (props) => {
  const { setModalState } = props;

  const { initialMttdValue, initialMttrValue } = useMetricsContext();
  const isUserInputtedData = initialMttdValue !== 0 && initialMttrValue !== 0;

  return (
    <Surface>
      {isUserInputtedData ? (
        <>
          <QueryKpi />
        </>
      ) : (
        <>
          {/* <Tooltip text="Click Here to add values">
            <WarningIcon />
          </Tooltip>
          <Button onClick={() => console.log("first")}>
            <Text>Click Here to add the BaseLine Values For Calculations</Text>
          </Button> */}
          <Flex>
            <Flex>
              <Tooltip text="Click Here to add values">
                <WarningIcon />
              </Tooltip>
            </Flex>
            <Flex onClick={() => setModalState(true)}>
              <Text>
                Click Here to add the BaseLine Values For Calculations
              </Text>
            </Flex>
          </Flex>
        </>
      )}
    </Surface>
  );
};

export default Home;
