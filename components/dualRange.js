import React, { useState } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

export default function DualRange() {
  const [value, setValue] = useState({ min: 0, max: 100 });

  return <InputRange maxValue={100} minValue={0} value={value} onChange={(value) => setValue(value)} />;
}
