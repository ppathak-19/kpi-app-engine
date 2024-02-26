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

export function getLastMonth() {
  const now = new Date();
  const lastday = new Date(now.getFullYear(), now.getMonth(), 0);
  const firstday = new Date(lastday.getFullYear(), lastday.getMonth(), 1);

  const formattedStartDate = formatDate(firstday);
  const formattedEndDate = formatDate(lastday);

  const timeframe = `${formattedStartDate}/${formattedEndDate}`;

  return timeframe;
}

export function getTwoDaysBeforeLastTwoDays() {
  let currentDate = new Date();
  let twoDaysAgo = new Date(currentDate);
  twoDaysAgo.setDate(currentDate.getDate() - 4);
  let twoDaysAfter = new Date(currentDate);
  twoDaysAfter.setDate(currentDate.getDate() - 2);

  let startDate = twoDaysAgo.toString();
  let endDate = twoDaysAfter.toString();

  const formattedStartDate = formatDate(new Date(startDate));
  const formattedEndDate = formatDate(new Date(endDate));

  const timeframe = `${formattedStartDate}/${formattedEndDate}`;

  return timeframe;
}
