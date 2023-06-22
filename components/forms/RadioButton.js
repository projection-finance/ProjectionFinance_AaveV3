const RadioButton = (props) => {
  const { label, checked, value, onChange, className } = props;

  return (
    <div className={`${className}`}>
      <label className="radio-container relative pl-5 mb-3 cursor-pointer text-white text-sm select-none">{label}
        <input className="absolute opacity-0 cursor-pointer" type="radio" value={value} checked={checked} onChange={onChange} name="radio" />
        <span className="checkmark"></span>
      </label>
    </div>
  )
};

export default RadioButton;