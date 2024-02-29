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

/** Converts the given minutes into actual time */
/** 237 -> 3 Hours 57 minutes */

export function convertKpiQueryMin_to_Time(minute: number) {
  let hour;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  const day = Math.floor(hour / 24);
  hour = hour % 24;

  const finalDays = day > 0 ? `${day} Days` : "";
  const finalHours = hour > 0 ? `${Math.floor(hour)} Hours` : "";
  const finalMinutes = minute >= 0 ? `${Math.floor(minute)} minutes` : "";

  const formattedTime = `${finalDays} ${finalHours} ${finalMinutes}`;
  return formattedTime;
}

export function formatDate(date: Date) {
  // leading zero if date/month is single digit
  const pad = (num) => (num < 10 ? "0" + num : num);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}T00:00:00Z`;
}

// get past months start and end date
export function getLastMonth(monthsBefore) {
  const now = new Date();

  const targetMonth = new Date(
    now.getFullYear(),
    now.getMonth() - monthsBefore,
    1
  );
  const firstDayOfTargetMonth = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth(),
    1
  );

  const lastDayOfTargetMonth = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0
  );

  const formattedStartDate = formatDate(firstDayOfTargetMonth);
  const formattedEndDate = formatDate(lastDayOfTargetMonth);

  const timeframe = `${formattedStartDate}/${formattedEndDate}`;

  return timeframe;
}

// gets days before past days
export function getBeforePastDays(numberOfDays) {
  const currentDate = new Date();
  const twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - (numberOfDays + numberOfDays));
  const twoDaysAfter = new Date(currentDate);
  twoDaysAfter.setDate(currentDate.getDate() - numberOfDays);

  const startDate = twoDaysAgo.toString();
  const endDate = twoDaysAfter.toString();

  const formattedStartDate = formatDate(new Date(startDate));
  const formattedEndDate = formatDate(new Date(endDate));

  const timeframe = `${formattedStartDate}/${formattedEndDate}`;

  return timeframe;
}
