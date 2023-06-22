import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Select = (props) => {
  const { options, value, onChange, className } = props;

  const [open, setOpen] = useState(false);

  const onClick = (id) => {
    onChange(id);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(state => !state);
  }

  return (
    <div className={`relative ${className}`}>
      <div onClick={onOpen} className="relative min-w-[180px] flex items-center justify-start gap-2 bg-transparent rounded text-xs pl-3 pr-10 py-2 border border-gray-dark hover:border-blue-crayola focus:border-blue-crayola">
        <div className="text-white select-none">{value?.label || 'Select asset'}</div>
        <ChevronDownIcon className={`absolute right-2 text-blue-crayola w-4 transition-all ${open ? "rotate-180" : "rotate-0"}`} />
      </div>
      {open && (
        <div className="absolute z-50 w-full max-h-[100px] overflow-y-auto py-2 border border-blue-crayola rounded bg-blue-dark">
          {options.map((item, index) => (
            <div key={index} onClick={() => onClick(item.id)} className="flex justify-start items-center gap-2 py-1 px-3 hover:bg-blue-crayola hover:bg-opacity-25">
              <div className="text-white text-xs select-none">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default Select;