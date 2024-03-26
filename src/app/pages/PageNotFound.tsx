import React from "react";
import type { AppCompProps } from "types";
import KPIFallBackUI from "../components/ReusableComponents/KPIFallBackUI";
import { Text } from "@dynatrace/strato-components-preview";

const PageNotFound: React.FC<AppCompProps> = () => {
  return (
    <KPIFallBackUI>
      <Text>Oops, Please Check the URL</Text>
    </KPIFallBackUI>
  );
};

export default PageNotFound;
