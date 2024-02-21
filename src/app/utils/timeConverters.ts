//  1707857340000  ->   "02:19:00"
export function convertUTCToDate(date: number | string) {
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
  evidenceStartTime: Date,
  returnAsString?: boolean
) {
  const timeDifferenceInMinutes = Math.abs(
    problemTime.getTime() - evidenceStartTime.getTime()
  );

  const minutes = Math.floor(timeDifferenceInMinutes / (1000 * 60));
  const hours = Math.floor(minutes / 60);

  if (returnAsString) {
    const formattedTime = `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:00`;

    return formattedTime;
  } else {
    // Returning in minutes
    return Math.abs(hours / 60 + minutes);
  }
}

export function convertMilliSecondsIntoDate(ms: number) {
  return new Date(ms).toString();
}

export function convertKpiQueryMS_to_Time(milliseconds: number) {
  let hour, minute;
  // seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(milliseconds / 60000000000);
  // seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  const day = Math.floor(hour / 24);
  hour = hour % 24;
  return {
    day: day,
    hour: hour,
    minute: minute,
  };
}
