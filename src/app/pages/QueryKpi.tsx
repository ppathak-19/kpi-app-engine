import { Surface, TitleBar } from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps } from "types";
import useGetKPIQueryData from "../hooks/useGetKPIQueryData";
import useGetSummarizationData from "../hooks/useGetSummarizationData";

const QueryKpi: React.FC<AppCompProps> = () => {
  const data = useGetKPIQueryData({ timeLine: "now()-10d" });

  const [resolvedDuration, setResolvedDuration] = useState<number[]>([]);

  useEffect(() => {
    if (!!data && data.records) {
      const resolved_problem_duration = data?.records?.map((eachR) =>
        Number(eachR?.resolved_problem_duration)
      );

      setResolvedDuration(resolved_problem_duration || []);
    }
  }, [data]);

  const sum = useGetSummarizationData(resolvedDuration || []);
  console.log(sum);

  return (
    <Surface>
      <TitleBar>
        <TitleBar.Title>Query KPI</TitleBar.Title>
      </TitleBar>
    </Surface>
  );
};

export default QueryKpi;
