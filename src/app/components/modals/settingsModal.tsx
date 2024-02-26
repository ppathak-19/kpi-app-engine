import {
  Button,
  Flex,
  FormField,
  Label,
  Modal,
  NumberInput,
} from "@dynatrace/strato-components-preview";
import React from "react";
import { Form } from "react-router-dom";
import styled from "styled-components";

interface SettingsModalProps {
  settingsModalState: boolean;
  setSettingsModalState: (val: boolean) => void;
}

const StyledLabel = styled(Label)<{
  required: boolean;
}>(({ required }) => ({
  ...(required ? { "&:after": { content: '"*"' } } : {}),
}));

export const SettingsModal = ({
  settingsModalState,
  setSettingsModalState,
}: SettingsModalProps) => {
  const footer = (
    <Button color="neutral" variant="accent">
      Submit
    </Button>
  );

  return (
    <Flex gap={4}>
      <Modal
        title="Configurations"
        footer={footer}
        show={settingsModalState}
        onDismiss={() => setSettingsModalState(false)}
      >
        <div style={{ padding: "12px" }}>
          <FormField
            label={
              <StyledLabel htmlFor="baseline-mttd" required={false}>
                Baseline MTTD
              </StyledLabel>
            }
          >
            <NumberInput
              id="baseline-mttd"
              placeholder="Enter baseline for MTTD"
            />
          </FormField>
        </div>

        <div style={{ padding: "12px" }}>
          <FormField
            label={
              <StyledLabel htmlFor="baseline-mttr" required={false}>
                Baseline MTTR
              </StyledLabel>
            }
          >
            <NumberInput
              id="baseline-mttr"
              placeholder="Enter baseline for MTTR"
            />
          </FormField>
        </div>
      </Modal>
    </Flex>
  );
};
