export const calculatePercentage = (x: number, y: number) => {
  if (x !== 0 && y !== 0) {
    const division = 1 - x / y;
    return Math.floor(division * 100);
  } else {
    return 0;
  }
};

export const calculateImprovement = (x: number, y: number) => {
  if (x !== 0 && y !== 0) {
    const i1 = x,
      i2 = y;
    const diffInIndexes = i1 - i2;
    const ratioDiff = diffInIndexes / i2;
    const result = ratioDiff * 100;
    return Math.floor(result);
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
