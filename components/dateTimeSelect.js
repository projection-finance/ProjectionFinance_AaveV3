import { Fragment, useState } from "react";
import { CalendarIcon } from "@heroicons/react/20/solid";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";
// import "react-calendar/dist/Calendar.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DateTimeSelect(props) {
  const theme = useSelector(state => state.themeReducers.theme);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [datePicked, setDatePicked] = useState(props.date);

  function onChange(nextValue) {
    setDatePicked(nextValue);
    setCalendarVisible(false);
  }
  const showCalendar = (event) => {
    setCalendarVisible(true);
  };
  const hideCalendar = (event) => {
    setCalendarVisible(false);
  };
  return (
    <div className={props.className}>
      <label htmlFor="email" className="block text-sm font-bold text-white">
        {props.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <CalendarIcon className="h-5 w-5 text-blue-primary" aria-hidden="true" />
        </div>
        <input id="date" onFocus={showCalendar} value={datePicked} name={props.name} readOnly className="block w-full appearance-none rounded-md bg-transparent border border-gray-dark/30 pl-10 pr-3 py-3 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-xs" placeholder="" />
      </div>
      <Calendar onChange={onChange} value={datePicked} locale="fr-FR" className={classNames("absolute", theme === 'dark' ? 'dark-calendar' : 'light-calendar', calendarVisible ? "" : "hidden")} />
    </div>
  );
}
