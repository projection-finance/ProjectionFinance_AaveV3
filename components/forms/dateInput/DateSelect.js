import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import Calendar from "react-calendar";

import { MONTHS } from "../../../utils/constants";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DateSelect(props) {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [datePicked, setDatePicked] = useState(props.date);
  const [displayDate, setDisplayDate] = useState(getDateToDisplayDate(props.date));

  function onChange(nextValue) {
    console.log(">>>>> nextvalue", nextValue);
    setDatePicked(nextValue);
    setCalendarVisible(false);
    setDisplayDate(getDateToDisplayDate(nextValue));
  }

  function getDateToDisplayDate(date) {
    const year = date.getFullYear();
    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    return month + " " + day + ", " + year;

  }

  return (
    <div className={props.className}>
      <label htmlFor="date" className="block text-sm font-bold text-white">
        {props.label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarIcon className="h-5 w-5 text-blue-crayola" aria-hidden="true" />
        </div>
        <input id="date" autoFocus={false} onClick={() => setCalendarVisible(state => !state)} value={displayDate} name={props.name} readOnly className="text-white block w-full appearance-none rounded-md bg-transparent border border-gray-dark pl-10 pr-3 py-3 placeholder-gray-400 shadow-sm focus:border-blue-crayola focus:outline-none focus:ring-blue-crayola sm:text-xs" placeholder="" />
      </div>
      <Calendar defaultValue={new Date()} value={new Date()} className={classNames("my-calendar rounded-lg absolute", "hidden")} />
    </div>
  );
}
