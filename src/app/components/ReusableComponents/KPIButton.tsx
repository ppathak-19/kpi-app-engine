import { Button } from "@dynatrace/strato-components-preview/buttons";
import React from "react";

type KPIButtonComponentProps = {
  label: string;
  onClick?: () => void;
};

const KPIButton: React.FC<KPIButtonComponentProps> = (props) => {
  const { label, onClick } = props;
  return (
    <Button
      color="neutral"
      variant="accent"
      // onClick={() => {
      //   console.log({ initialMttdValue, initialMttrValue });
      //   setNestedModalState(true);
      // }}
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

export default KPIButton;
