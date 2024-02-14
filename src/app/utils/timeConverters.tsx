//  1707857340000  ->   "02:19:00"
export function convertUTCToDate(date: number) {
  return new Date(date);
}

export function convertUTCToTime(date: number) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatProblemTimeWithDiff(
  problemTime: Date,
  evidenceStartTime: Date
) {
  const timeDifferenceInMinutes = Math.abs(
    problemTime.getTime() - evidenceStartTime.getTime()
  );

  const minutes = Math.floor(timeDifferenceInMinutes / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  const formattedTime = `${hours.toString().padStart(2, "0")}:${(minutes % 60)
    .toString()
    .padStart(2, "0")}:00`;

  return formattedTime;
}
