import {
  Flex,
  Surface,
} from "@dynatrace/strato-components-preview/layouts-core";
import React from "react";

type KPIFallBackUIProps = {
  children: React.ReactNode;
};

const KPIFallBackUI: React.FC<KPIFallBackUIProps> = ({ children }) => {
  return (
    <Surface height={400}>
      <Flex
        style={{
          textAlign: "center",
          cursor: "pointer",
        }}
        justifyContent="center"
        alignContent="center"
      >
        {children}
      </Flex>
    </Surface>
  );
};

export default KPIFallBackUI;
