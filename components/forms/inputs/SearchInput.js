import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchInput = (props) => {
  const { type, value, onChange, label, placeholder, className, autoFocus } = props;

  return (
    <div className="">
      {label && <div className="text-white text-xs mb-2">{label}</div>}
      <div className="relative">
        <input
          autoFocus={autoFocus}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={`${className} w-full border rounded border-gray-dark pl-8 pr-2 py-2 text-xs text-white bg-transparent focus:outline-none focus:border-blue-crayola`}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-0 bottom-0 m-auto text-white w-3" />
      </div>
    </div>
  )
};

export default SearchInput;