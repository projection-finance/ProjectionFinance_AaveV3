const Input = (props) => {
  const { editable = true, type, value, onChange, placeholder, label, className, autoFocus } = props;

  return (
    <div className={`w-full ${className}`}>
      {label && <div className="text-white text-xs mb-2">{label}</div>}
      {editable ?
        <input
          autoFocus={autoFocus}
          type={type}
          value={value === 0 ? "0" : value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full px-3 py-2 text-xs rounded border border-gray-dark text-white bg-transparent focus:border-blue-crayola focus:outline-none"
        /> :
        <div className="min-h-5 w-full px-3 py-2 text-xs text-white rounded border border-gray-dark">{value}</div>
      }
    </div>
  )
};

export default Input;