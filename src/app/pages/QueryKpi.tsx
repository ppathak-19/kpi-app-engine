import {
  DataTable,
  Flex,
  Heading,
  Surface,
  TableColumn,
  TitleBar,
} from "@dynatrace/strato-components-preview";
import React, { useEffect, useState } from "react";
import type { AppCompProps } from "types";
import useGetKPIQueryData from "../hooks/useGetKPIQueryData";
import useGetSummarizationData from "../hooks/useGetSummarizationData";
import { queryKPITableColumn } from "../constants/problemTableColumns";

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
        <TitleBar.Title>KPI for Problems</TitleBar.Title>
      </TitleBar>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>MTTD</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumn}
          data={[]}
        />
      </Flex>
      <Flex flexDirection="column" padding={20}>
        <Heading level={2}>MTTR</Heading>
        <DataTable
          resizable
          fullWidth
          columns={queryKPITableColumn}
          data={[]}
        />
      </Flex>
    </Surface>
  );
};

export default QueryKpi;
