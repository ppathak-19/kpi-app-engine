import {
  convertUTCToDate,
  formatProblemTimeWithDiff,
} from "../utils/timeConverters";

export const useGetTotalKpiDifference = (dataTillTimeRange) => {
  const calculateMetrics = (record) => {
    const mttd = formatProblemTimeWithDiff(
      convertUTCToDate(record?.["event.start"] as string),
      convertUTCToDate(record?.["res.event.start"] as string)
    );
    const mttr = formatProblemTimeWithDiff(
      convertUTCToDate(record?.["event.start"] as string),
      convertUTCToDate(record?.["event.end"] as string)
    );
    return { mttd, mttr };
  };

  // Calculate timestamps for the past 2 days, past 7 days, and previous month
  const twoDaysAgoTimestamp = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const sevenDaysAgoTimestamp = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const previousMonthTimestamp = new Date().setMonth(new Date().getMonth() - 1);
  const twentyTwoDaysAgoTimestamp = Date.now() - 22 * 24 * 60 * 60 * 1000;

  const results: any[] = [];

  console.log(previousMonthTimestamp, "month");

  dataTillTimeRange?.records.forEach((eachR) => {
    const { mttd, mttr } = calculateMetrics(eachR);

    if (Date.parse(eachR?.["event.start"]) >= twoDaysAgoTimestamp) {
      results.push({
        mttdTimeTwoDays: mttd,
        mttrTimeTwoDays: mttr,
      });
    }
    if (Date.parse(eachR?.["event.start"]) >= sevenDaysAgoTimestamp) {
      results.push({
        mttdTimeSevenDays: mttd,
        mttrTimeSevenDays: mttr,
      });
    }
    if (Date.parse(eachR?.["event.start"]) >= previousMonthTimestamp) {
      results.push({
        mttdTimeMonthly: mttd,
        mttrTimeMonthly: mttr,
      });
    }
    if (Date.parse(eachR?.["event.start"]) >= twentyTwoDaysAgoTimestamp) {
      results.push({
        mttdTimeTwentyTwoDay: mttd,
        mttrTimeTwentyTwoDay: mttr,
      });
    }
  });

  // calculating metrics
  const calculateMetricsStats = (data, key) => {
    console.log(data, "val");
    const values = data.map((item) => item[key]);

    const validValues = values.filter((value) => !isNaN(value) && value !== "");

    if (validValues.length === 0) {
      return { min: 0, max: 0, avg: 0, median: 0 };
    }

    const min = Math.min(...validValues);
    const max = Math.round(Math.max(...validValues));

    const sum = validValues.reduce((acc, val) => acc + val, 0);
    const avg = Math.round(sum / validValues.length);

    validValues.sort((a, b) => a - b);
    const median =
      validValues.length % 2 === 0
        ? (validValues[validValues.length / 2 - 1] +
            validValues[validValues.length / 2]) /
          2
        : validValues[Math.floor(validValues.length / 2)];
    return { min, max, avg, median };
  };

  // Calculate metrics stats for each time range
  const metricsStats = [
    {
      mttdTimeTwoDays: calculateMetricsStats(results, "mttdTimeTwoDays"),
      mttrTimeTwoDays: calculateMetricsStats(results, "mttrTimeTwoDays"),
      mttdTimeSevenDays: calculateMetricsStats(results, "mttdTimeSevenDays"),
      mttrTimeSevenDays: calculateMetricsStats(results, "mttrTimeSevenDays"),
      mttdTimeMonthly: calculateMetricsStats(results, "mttdTimeMonthly"),
      mttrTimeMonthly: calculateMetricsStats(results, "mttrTimeMonthly"),
      mttdTimeTwentyTwoDay: calculateMetricsStats(
        results,
        "mttdTimeTwentyTwoDay"
      ),
      mttrTimeTwentyTwoDay: calculateMetricsStats(
        results,
        "mttrTimeTwentyTwoDay"
      ),
    },
  ];

  return metricsStats;
};
