const ButtonText = (props) => {
  const { text, onClick} = props;

  return (
    <div className="select-none text-xs text-blue-tiful cursor-pointer" onClick={onClick}>{text}</div>
  )
};

export default ButtonText;