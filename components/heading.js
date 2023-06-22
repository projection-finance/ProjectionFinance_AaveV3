import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Heading(props) {
  return (
    <div className={classNames(props.className, "flex flex-col")}>
      <p className="mt-1 truncate text-xs text-gray-500">{props.sub}</p>
      <h1 id="message-heading" className="text-xl font-bold text-gray-dark dark:text-white">
        {props.title}
      </h1>
    </div>
  );
}
