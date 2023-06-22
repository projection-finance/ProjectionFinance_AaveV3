const RangeButtons = (props) => {
  const { value = '1d', className, onChange } = props;

  const ranges = ['1d', '1w', '1m', '6m', '1y']

  return (
    <div className={`${className} flex items-center`}>
      {ranges.map((item, index) => (
        <button onClick={() => onChange(ranges[index])} className={`rounded px-2 py-1.5 transition-all text-xs ${value === ranges[index] ? 'text-blue-crayola border border-blue-crayola' : 'text-gray-light border border-transparent hover:border hover:border-blue-crayola/50'}`} key={index}>{item.toUpperCase()}</button>
      ))}
    </div>
  )
};

export default RangeButtons;