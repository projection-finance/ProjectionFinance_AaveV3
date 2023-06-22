import React from "react";
const Btn = React.forwardRef(({ onClick, href, className, label }, ref) => {
  return (
    <a ref={ref} className={`${className} cursor-pointer text-center text-xxs font-medium font-inter py-2 rounded-md bg-blue-crayola text-white hover:bg-blue-tiful focus:outline-none focus:ring focus:ring-blue-tiful-300`}>
      {label}
    </a>
  );
});

Btn.displayName = "Btn";
export default Btn;
