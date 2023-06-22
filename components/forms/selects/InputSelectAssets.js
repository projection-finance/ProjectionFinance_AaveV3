import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { DEFAULT_ASSETS } from '../../../utils/constants';

import CryptoIcon from "../../CryptoIcon";

const InputSelectAssets = (props) => {
  const { options = DEFAULT_ASSETS, value, onChange, className, locked = false } = props;

  const [open, setOpen] = useState(false);

  const onClick = (id) => {
    onChange(id);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(state => !state);
  }

  return (
    <div className={`relative ${!locked ? "w-36" : "w-fit"} ${className}`}>
      <div onClick={onOpen} className="relative flex items-center justify-start gap-2 bg-transparent rounded text-xs px-3 py-2 border border-gray-dark hover:border-blue-crayola focus:border-blue-crayola">
        <CryptoIcon label={value?.key} className="w-4 select-none" />
        <div className="text-white select-none">{value?.label || 'Select asset'}</div>
        {!locked && <ChevronDownIcon className={`absolute right-2 text-blue-crayola w-4 transition-all ${open ? "rotate-180" : "rotate-0"}`} />}
      </div>
      {open && !locked && (
        <div className="absolute z-50 w-full max-h-[200px] overflow-y-auto py-2 border border-blue-crayola rounded bg-blue-dark">
          {options.map((item, index) => (
            <div key={index} onClick={() => onClick(item.id)} className="flex justify-start items-center gap-2 py-1 px-3 hover:bg-blue-crayola hover:bg-opacity-25">
              <CryptoIcon label={item.key} className="w-4 select-none" />
              <div className="text-white text-xs select-none">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
};

export default InputSelectAssets;