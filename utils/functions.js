import { MONTHS } from "./constants";

// Milliseconds to date object
export const millisecondsToDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dates = {
    year,
    month,
    day
  };

  return dates;
};

// Get maximum value in object array
export const getMax = (data, key) => {
  let MAX = -1000000000;
  data.forEach(item => {
    if (MAX <= item[key]) {
      MAX = item[key]
    }
  });

  return MAX;
};

// Get minimum value in object array
export const getMin = (data, key) => {
  let MIN = 100000000000000;
  data.forEach(item => {
    if (MIN >= item[key]) {
      MIN = item[key]
    };
  });

  return MIN;
};

// Milliseconds to "2:30 PM"
export const formatTime = (milliseconds) => {
  const date = new Date(milliseconds);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12' for AM/PM
  const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

  return formattedTime;
};

// Milliseconds to "Nov 1"
export const formatMonthDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const month = date.getMonth();
  const day = date.getDate();

  return MONTHS[month] + " " + day;
}

export const formatMonthYearDate = (milliseconds) => {
  const date = new Date(milliseconds);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  return MONTHS[month] + " " + day + ", " + year;
}
// Milliseconds of 2022 01 01 14:30 30s to milliseconds of 2022 01 01 00:00 00s.
export const milliToDateMilli = (milliseconds) => {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const midnight = new Date(year, month, day, 0, 0, 0, 0);
  const result = midnight.getTime();

  return result;
}