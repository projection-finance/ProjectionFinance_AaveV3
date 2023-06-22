const ButtonOutlined = ({ onClick, className, label, disabled = false, title = '' }) => {
  const defaultStyle = "select-none py-1 font-sans border border-blue-crayola cursor-pointer text-center font-medium font-inter rounded-md focus:outline-none focus:ring focus:ring-blue-tiful-300"
  const activeStyle = "bg-blue-dark hover:bg-blue-darker text-white";
  const disabledStyle = "bg-disabled text-disabled-txt";

  const handleClick = () => {
    !disabled && onClick();
  }

  return (
    <div
      onClick={handleClick}
      className={`${className} ${disabled ? disabledStyle : activeStyle} ${defaultStyle} `}
      title={title}
    >
      {label}
    </div>
  );
};

export default ButtonOutlined;