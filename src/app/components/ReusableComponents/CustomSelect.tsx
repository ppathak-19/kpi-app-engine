import {
  FormField,
  SelectV2,
  SelectV2SingleValue,
} from "@dynatrace/strato-components-preview";
import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  value: string | null;
  onChange: (value: SelectV2SingleValue<string>) => void;
  options: SelectOption[];
  setLoading: (val: boolean) => void;
}

export const CustomSelect = ({
  label,
  value,
  onChange,
  options,
  setLoading,
}: CustomSelectProps) => {
  const handleOnChange = (e: SelectV2SingleValue<string>) => {
    setLoading(true);
    onChange(e);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <FormField label={label}>
      <SelectV2 value={value} onChange={handleOnChange}>
        <SelectV2.Trigger width="200px" />
        <SelectV2.Content>
          {options.map((option) => (
            <SelectV2.Option key={option.value} value={option.value}>
              {option.label}
            </SelectV2.Option>
          ))}
        </SelectV2.Content>
      </SelectV2>
    </FormField>
  );
};
