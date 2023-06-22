const TimeInput = (props) => {
    const { value, onChange, className } = props;
;

    return (
        <input type='time' autoClose="true" value={value} onChange={onChange} className={`appearance-none rounded bg-transparent border border-gray-dark px-3 py-2 text-white text-sm focus:border-blue-crayola focus:outline-none focus:ring-blue-crayola ${className}`} />
    )
};

export default TimeInput;