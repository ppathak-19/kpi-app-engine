import {
  FormField,
  Label,
  NumberInput,
} from "@dynatrace/strato-components-preview/forms";
import React from "react";
import styled from "styled-components";

type KPINumberInputComponentProps = {
  label: string;
  value: number | null;
  onChange?: ((value: number | null) => void) | undefined;
  placeholder?: string;
};

const StyledLabel = styled(Label)<{
  required: boolean;
}>(({ required }) => ({
  ...(required ? { "&:after": { content: '"*"' } } : {}),
}));

const KPINumberInput: React.FC<KPINumberInputComponentProps> = (props) => {
  const { label, value, onChange, placeholder } = props;
  return (
    <FormField
      label={
        <StyledLabel htmlFor="baseline-mttd" required={true}>
          {label}
        </StyledLabel>
      }
    >
      <NumberInput
        id="baseline-mttd"
        placeholder={placeholder || ""}
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
};

export default KPINumberInput;
