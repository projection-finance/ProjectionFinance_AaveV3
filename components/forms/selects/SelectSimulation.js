import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { DEFAULT_ASSETS } from '../../../utils/constants';

const SelectSimulation = (props) => {
  const { options = DEFAULT_ASSETS, value, onChange, className, locked = false } = props;

  const [open, setOpen] = useState(false);

  const onClick = (item) => {
    onChange(item);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(open => !open);
  }

  return (
    <div className={`relative ${!locked ? "w-36" : "w-fit"} ${className}`}>
      <div onClick={onOpen} className="relative flex items-center justify-start ml-4 rounded text-sm hover:border-blue-crayola focus:border-blue-crayola">
        
        <div className="text-white select-none">{value || 'Select simulation'}</div>
        {!locked && <ChevronDownIcon className={`absolute right-2 text-blue-crayola w-4 transition-all ${open ? "rotate-180" : "rotate-0"}`} />}
      </div>
      {open && !locked && (
        <div className="absolute z-5000 w-full max-h-[102px] overflow-y-auto py-2 border border-blue-crayola rounded bg-blue-dark">
          {options.map((item, index) => (
            <div key={index} onClick={() => onClick(item)} className="flex justify-start items-center gap-2 py-1 px-3 hover:bg-blue-crayola hover:bg-opacity-25">
              <div className="text-white text-sm select-none">{item}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default SelectSimulation;