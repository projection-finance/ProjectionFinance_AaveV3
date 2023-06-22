const NoborderInput = (props) => {
  const { type, value, onChange, placeholder, className, autoFocus } = props;

  return (
    <input
      autoFocus={autoFocus}
      type={type}
      value={value === 0 ? "" : value}
      placeholder={placeholder}
      onChange={onChange}
      className={`${className} w-full border-0 text-white font-bold bg-transparent text-lg focus:outline-none focus:shadow-none focus:ring-transparent`} />
  )
};

export default NoborderInput;