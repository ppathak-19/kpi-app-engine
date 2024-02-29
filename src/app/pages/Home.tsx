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
import { Button } from "@dynatrace/strato-components-preview";

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
        <Surface height={400}>
          <Flex
            style={{
              textAlign: "center",
              cursor: "pointer",
            }}
            justifyContent="center"
            alignContent="center"
          >
            <Flex>
              <Button color="warning" size="condensed">
                <Tooltip text="Click Here to add values">
                  <WarningIcon />
                </Tooltip>
              </Button>
            </Flex>
            <Flex onClick={() => setModalState(true)}>
              <Text>
                Click Here to add the BaseLine Values For Calculations
              </Text>
            </Flex>
          </Flex>
        </Surface>
      )}
    </Surface>
  );
};

export default Home;
