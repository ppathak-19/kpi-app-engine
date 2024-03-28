export const calculatePercentage = (x: number, y: number) => {
  if (x !== 0 && y !== 0) {
    const division = (x - y) / y;
    return Math.floor(division * 100);
  } else {
    return 0;
  }
};

export const calculateImprovementWithPreviousdata = (x: number, y: number) => {
  if (x !== 0 && y !== 0) {
    const division = x / y - 1;
    return Math.floor(division * 100);
  } else {
    return 0;
  }
};

export const convertNumberIntoK = (val: number) => {
  const res = new Intl.NumberFormat("en", { notation: "compact" }).format(val);
  return res;
};

export const calculateDiffInHours = (
  kpi: number,
  baseline: number,
  salary: number
) => {
  // console.log({ kpi, baseline, salary });
  const diffInHours = (baseline - kpi) / 60;

  const perHourSalary = diffInHours * salary;

  return Math.round(perHourSalary);
};
