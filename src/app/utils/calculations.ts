export const calculatePercentage = (x: number, y: number) => {
  if (x !== 0 && y !== 0) {
    const division = x / y;
    return Math.floor(division * 100);
  } else {
    return 0;
  }
};
