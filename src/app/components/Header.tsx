import { Button, Flex, TitleBar } from "@dynatrace/strato-components-preview";
import { InformationIcon, SettingIcon } from "@dynatrace/strato-icons";
import React from "react";

type HeaderProps = {
  setInfoModalState: React.Dispatch<React.SetStateAction<boolean>>;
  setSettingModalState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { setInfoModalState, setSettingModalState } = props;
  return (
    <Flex p={8}>
      <TitleBar>
        <TitleBar.Title>Business Impact App</TitleBar.Title>
        <TitleBar.Suffix>
          <TitleBar.Suffix>
            <Flex gap={4}>
              <Button
                variant="default"
                data-testid="open-info-modal-button"
                onClick={() => setInfoModalState(true)}
              >
                <Button.Prefix>{<InformationIcon />}</Button.Prefix>
                Info
              </Button>
              <Button
                variant="default"
                data-testid="open-settings-modal-button"
                onClick={() => setSettingModalState(true)}
              >
                <Button.Prefix>{<SettingIcon />}</Button.Prefix>Settings
              </Button>
            </Flex>
          </TitleBar.Suffix>
        </TitleBar.Suffix>
      </TitleBar>
    </Flex>
  );
};

export default Header;
