import { Button } from "@dynatrace/strato-components-preview";
import {
  Flex,
  Surface,
} from "@dynatrace/strato-components-preview/layouts-core";
import { Tooltip } from "@dynatrace/strato-components-preview/overlays";
import {
  Heading,
  Paragraph,
  Text,
} from "@dynatrace/strato-components-preview/typography";
import { ExpandableText } from "@dynatrace/strato-components-preview/content";
import { WarningIcon } from "@dynatrace/strato-icons";
import React from "react";
import { useAppContext } from "../hooks/Context-API/AppContext";
import QueryKpi from "./QueryKpi";
import KPIFallBackUI from "../components/ReusableComponents/KPIFallBackUI";

type HomeCompProps = {
  setModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Home: React.FC<HomeCompProps> = (props) => {
  const { setModalState } = props;

  const { state, error } = useAppContext();
  const isUserInputtedData =
    !!state.baseline.mttd &&
    state.baseline.mttd !== 0 &&
    !!state.baseline.mttr &&
    state.baseline.mttr !== 0;

  const isErrorInApp = error.isError;

  return (
    <Surface>
      {isErrorInApp ? (
        <>
          <KPIFallBackUI>
            <Heading level={4}>Oops, An Error Occured</Heading>
            <br />
            <ExpandableText>
              <Paragraph>
                {error.errorDetails.code}-{error.errorDetails.message}
              </Paragraph>
            </ExpandableText>
          </KPIFallBackUI>
        </>
      ) : (
        <>
          {isUserInputtedData ? (
            <>
              <QueryKpi />
            </>
          ) : (
            <KPIFallBackUI>
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
            </KPIFallBackUI>
          )}
        </>
      )}
    </Surface>
  );
};

export default Home;
