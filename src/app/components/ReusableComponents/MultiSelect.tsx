import { SelectV2 } from "@dynatrace/strato-components-preview";
import { CriticalIcon } from "@dynatrace/strato-icons";
import { Text } from "@dynatrace/strato-components-preview/typography";
import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
  options: Array<SelectOption>;
}

export const MultiSelect = ({ value, onChange, options }: MultiSelectProps) => {
  return (
    <SelectV2 value={value} onChange={onChange} multiple clearable>
      <SelectV2.Trigger>
        <SelectV2.DisplayValue>
          <SelectV2.Prefix>
            <CriticalIcon />
          </SelectV2.Prefix>
          <Text>
            {value && value.length > 0
              ? value.join(", ")
              : "Select Event Category"}
          </Text>
        </SelectV2.DisplayValue>
      </SelectV2.Trigger>
      <SelectV2.Content>
        {options.map(({ value, label }) => (
          <SelectV2.Option key={`category-${value}`} value={value}>
            {label}
          </SelectV2.Option>
        ))}
      </SelectV2.Content>
    </SelectV2>
  );
};
