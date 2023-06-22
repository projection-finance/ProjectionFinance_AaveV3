import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Image from "next/image";
import { useRouter } from "next/router";

const market = [
  { name: 'Ethereum v3', market: 'mainnet_v3', icon : '/icons/networks/ethereum.svg' },
  { name: 'Arbitrum v3', market: 'arbitrum_v3',icon : '/icons/networks/arbitrum.svg' },
  { name: 'Fantom v3', market: 'fantom_v3', icon : '/icons/networks/fantom.svg' },
  { name: 'Harmony v3', market: 'harmony_v3', icon : '/icons/networks/harmony.svg' },
  { name: 'Optimism v3', market: 'optimism_v3', icon : '/icons/networks/optimism.svg' },
  { name: 'Avalanche v3', market: 'avalanche_v3', icon : '/icons/networks/avalanche.svg' },
  { name: 'Polygon v3', market: 'polygon_v3', icon : '/icons/networks/polygon.svg' },
  { name: 'Metis v3', market: 'metis_v3', icon : '/icons/networks/metis.svg' }
];

const List = (props) => {
  const router = useRouter();
  const userWallet = props.userWallet;
  const selectedMarket = props.currentMarket || 'mainnet_v3';
  const [selected, setSelected] = useState(market.find(item => item.market === selectedMarket));
  const selectedMarketObj = market.find(item => item.market === selectedMarket);
  const selectedIcon = selectedMarketObj.icon;
  const options = market.filter(option => option.market !== selectedMarket);
  
  const handleMarketChange = (value) => {
    setSelected(value);
    router.push(`/position/${userWallet}/${value.market}/`);
    props.setMarket(value.market)
  };
  return (
    <div className="z-10 w-[200px] mx-4 step_2">
      <Listbox value={selected} onChange={handleMarketChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-black/20 text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <div className="flex items-center">
              <Image src={selectedIcon} width={20} height={20} alt="token" />
              <span className="block truncate ml-4 text-gray-dark dark:text-white">{selected.name} a b c</span>
              <span className="pointer-events-none ml-2 flex items-center">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-dark dark:text-white" aria-hidden="true" />
              </span>
            </div>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-black py-1 text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                ? 'bg-light-hover dark:bg-blue-tiful text-gray-dark dark:text-white'
                : 'text-gray-dark dark:text-white'}`}
              value={option}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    <Image src={option.icon} width={16} height={16} alt="icon" /> {option.name}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </div>
  </Listbox>
</div>
);
};

List.displayName = "List";
export default List;