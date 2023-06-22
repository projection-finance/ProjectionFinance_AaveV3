const ButtonFilled = (props) => {
  const { onClick, className, label, disabled = false } = props;

  const defaultStyle = "select-none border border-transparent transition-all min-w-[120px] py-2 px-5 font-sans text-center text-xs font-medium font-inter rounded focus:outline-none focus:ring focus:ring-blue-tiful-300"
  const activeStyle = "bg-blue-crayola hover:bg-blue-tiful text-white cursor-pointer";
  const disabledStyle = "bg-disabled-bg text-disabled-txt";

  const handleClick = () => {
    !disabled && onClick();
  }

  return (
    <div
      onClick={handleClick}
      className={`${className} ${disabled ? disabledStyle : activeStyle} ${defaultStyle}`}
    >
      {label}
    </div>
  );
};

export default ButtonFilled;
