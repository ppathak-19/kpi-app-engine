import { Flex } from "@dynatrace/strato-components-preview";
import React, { useState } from "react";
import type { AppCompProps } from "types";
import useGetKPIMetrices from "../hooks/useGetKPIMetrices";
import { getBeforePastDays } from "../utils/timeConverters";
import MetricDetailSection from "../components/MetricDetailSection";

const QueryKpi: React.FC<AppCompProps> = () => {
  const [selectTimeFrame, setSelectTimeFrame] = useState<string | null>("2");

  /** Getting Metrices for Last 2 Days */
  const daysData = useGetKPIMetrices({
    timeLine1: `now()-${selectTimeFrame}d`,
    shouldUseTimeFrame1: false,
    timeLine2: getBeforePastDays(2),
    shouldUseTimeFrame2: true,
  });

  const handleTimeFrameChange = (time: string) => {
    setSelectTimeFrame(time);
  };

  return (
    <Flex>
      <MetricDetailSection
        daysData={daysData}
        selectedTimeFrame={selectTimeFrame}
        setSelectedTimeFrame={handleTimeFrameChange}
      />
    </Flex>
  );
};

export default QueryKpi;
