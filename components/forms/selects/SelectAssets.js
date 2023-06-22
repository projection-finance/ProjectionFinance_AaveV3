import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';


import CryptoIcon from "../../CryptoIcon";
import Image from 'next/image';

const SelectAssets = (props) => {
  const { options , value, onChange, className, locked = false, displayQty = true} = props;

  const [open, setOpen] = useState(false);

  const onClick = (id) => {
    onChange(id);
    setOpen(false);
  };

  const onOpen = () => {
    setOpen(state => !state);
  }

  return (
<div className={`relative ${!locked ? "w-48" : "w-fit"} ${className}`}>
<div onClick={onOpen} className="relative flex items-center justify-middle gap-2 bg-gray-darker rounded text-sm p-3 hover:border-blue-crayola focus:border-blue-crayola">
  {value && <Image src={"/icons/tokens/" + value?.icon?.toLowerCase() + ".svg"} width="20" height="20" alt="token" /> }
  <div className="text-white truncate">{value?.symbol || 'Select asset'}</div>
  {!locked && <ChevronDownIcon className={`absolute right-2 text-blue-crayola w-4 transition-all ${open ? "rotate-180" : "rotate-0"}`} />}
</div>
  {open && !locked && (
    <div className="absolute z-50 w-full max-h-[102px] overflow-y-auto py-2 border border-blue-crayola rounded bg-blue-dark">
      {options.map((item, index) => (
        <div key={index} onClick={() => onClick(item.id)} className="flex justify-start items-center gap-2 py-1 px-3 hover:bg-blue-crayola hover:bg-opacity-25">
          {/* <CryptoIcon label={item.symbol} className="w-4 select-none" /> */}
          <Image src={"/icons/tokens/" + item?.icon?.toLowerCase() + ".svg"} width="20" height="20" alt="token" />
          <div className="text-white text-sm select-none inline-block">{item.symbol}</div>
          {displayQty && <div className="text-white text-xs select-none inline-block">{item.qty}</div>}
        </div>
      ))}
    </div>
  )}
</div>

  )
};

export default SelectAssets;