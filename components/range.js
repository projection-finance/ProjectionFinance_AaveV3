import { useEffect, useState } from "react";

export default function Range(props) {
  const medium = props.max && props.max ? props.max - Math.abs(props.min) : 50;
  const [rangeValue, setRangeValue] = useState(props.value);
  const writable = props.writable != null ? props.writable : false;
  const handleRangeValue = (event) => {
    if (isNaN(event.target.value) || event.target.value === "" || event.target.value === null) {
      setRangeValue(0);
      props.handleValue(0);
    } else {
      if (parseFloat(event.target.value) < parseFloat(props.min)) {
        event.target.value = props.min;
      }
      setRangeValue(event.target.value);
      props.handleValue(event.target.value);
    }
  };

  const getData = () => {
    return rangeValue;
  };

  if (props?.extRef) {
    props.extRef.current = {
      getData,
    };
  }

  useEffect(() => {
    setRangeValue(props.value);
  }, [props]);

  return (
    <div className={props.className}>
      <label htmlFor="default-range" className="block text-xs font-medium text-gray-dark dark:text-white">
        {props.title}
      </label>
      <input id="default-range" value={rangeValue} step={props.step ? props.step : 1} min={props.min ? props.min : 0} max={props.max ? props.max : 100} onChange={handleRangeValue} type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
      <input id="range-value" readOnly={!writable} onChange={handleRangeValue} value={rangeValue} name="range-value" className="text-center block w-full appearance-none rounded-md bg-transparent border border-gray-dark/30 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm" />
    </div>
  );
}
