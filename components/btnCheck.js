import { useState, useEffect } from "react";

const BtnCheck = (props) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("pink-500");

  useEffect(() => {
    setLabel(props.label);
    setColor(props.color);
  }, [props]);

  return (
    <label className="text-white rounded-md border border-gray-dark p-2 box-content inline-block">
      <input type="checkbox" className={`accent-${color}`} /> {label}
    </label>
  );
};

export default BtnCheck;
