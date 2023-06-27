import { Fragment, useState, useRef, useEffect } from "react";
import moment from 'moment';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import ModalLoading from "./modalLoading";
import Input from '../components/forms/inputs/Input';
import Select from '../components/forms/selects/Select';
import CheckButton from "./forms/CheckButton";
import Range from '../components/range';
import axios from 'axios'
import { ethers } from "ethers";

export default function ModalSelectWallet(props) {
  const router = useRouter();
  const durationRef = useRef();

  const options = [
    {
      id: "mainnet_v3",
      value: "mainnet_v3",
      label: "Ethereum"
    }, {
      id: "polygon_v3",
      value: "polygon_v3",
      label: "Polygon"
    }, {
      id: "fantom_v3",
      value: "fantom_v3",
      label: "Fantom"
    }, {
      id: "arbitrum_v3",
      value: "arbitrum_v3",
      label: "Arbitrum"
    }, {
      id: "optimism_v3",
      value: "optimism_v3",
      label: "Optimism"
    }, {
      id: "avalanche_v3",
      value: "avalanche_v3",
      label: "Avalanche"
    }, {
      id: "harmony_v3",
      value: "harmony_v3",
      label: "Harmony"
    }, {
      id: "metis_v3",
      value: "metis_v3",
      label: "Metis"
    }
  ]

  const theme = useSelector(state => state.themeReducers.theme) ?? 'dark';
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState("0xd56353e0bdc41ad232f9d11109868703c1e2b2b9");
  const [simulationName, setSimulationName] = useState("");
  const [selectedMarket, setSelectedMarket] = useState('mainnet_v3');
  const [isPrivate, setIsPrivate] = useState(false);
  const [endDate, setEndDate] = useState();
  const [duration, setDuration] = useState('30');

  const [startDate,] = useState(new Date());

  useEffect(() => {
    const end = moment(startDate).add(duration, 'days').valueOf();
    setEndDate(new Date(end))
  }, [duration, startDate])

  const handleWallet = (e) => {
    setWallet(e.target.value);
  };

  const handleName = (e) => {
    setSimulationName(e.target.value);
  }

  const handleMarket = (value) => {
    setSelectedMarket(value)
  };

  const [error, setError] = useState(false);


  async function handleSubmit() {
    if (!simulationName) {
      setError('Simulation name is required.')
      return;
    }
    setError('');
    setLoading(true);
    const provider = new ethers.providers.StaticJsonRpcProvider("https://cloudflare-eth.com");
    const [ensAddress, evmAddress] = wallet.includes(".eth") || wallet.includes(".ETH") ? [wallet, await provider.resolveName(wallet)] : [wallet, wallet];
    setWallet(evmAddress);
    const displayAddress = ensAddress || evmAddress;
    const start = startDate;
    const end = new Date(endDate);

    if (start.getTime() > end.getTime()) {
      setError('The start date cannot be later than the end date.')
      return
    }
    try {
      const urlPreLoad = `/api/position/${evmAddress}/${selectedMarket}/`
      const positionData = await axios.get(urlPreLoad);

      let startPositions = positionData?.data?.positions?.userSummary.userReservesData.filter((token) => token.scaledATokenBalance > -1);
      const tokenPositions = [];

      let currentDay = moment(start);

      let lastDay = moment(end);
      let tokenDates = [];
      while (currentDay <= lastDay) {
        currentDay.add(1, "days");
        tokenDates.push(moment(currentDay).format("MM.DD.YYYY"));
      }
      startPositions.map((position) => {

        if (position.reserve.borrowingEnabled) {
          var variableBorrowAPY = (
            position
              ?.reserve.variableBorrowAPY * 100)
            ?.toFixed(2) ?? -1;
          var stableBorrowAPY = position.reserve.stableBorrowRateEnabled
            ? (
              position
                ?.reserve.stableBorrowAPY * 100)
              ?.toFixed(2)
            : -1;
        } else {
          var variableBorrowAPY = -1;
          var stableBorrowAPY = -1;
        }

        let supplyAPY = Number(
          position
            ?.reserve.supplyAPY * 100).toFixed(2);

        let tokenPrice = position
          ?.reserve.formattedPriceInMarketReferenceCurrency;
        if (tokenPrice && !Number.isInteger(tokenPrice)) {
          tokenPrice = Number(tokenPrice).toFixed(2);
        }
        let tokenConfig = {
          linear: true,
          start_price: tokenPrice,
          percent_evolution: 0,
          loop: tokenDates.length,
          seed: 5,
          mu: 0.01,
          sigma: 0.003,
          variableBorrowAPY: variableBorrowAPY,
          stableBorrowAPY: stableBorrowAPY,
          supplyAPY: supplyAPY
        };

        tokenPositions.push({
          id: position.id,
          startDate: startDate,
          endDate: endDate,
          dates: tokenDates,
          config: tokenConfig,
          values: Array(tokenDates.length + 1).fill(tokenPrice)
        });
      })

      const result = await axios.post("/api/simulation/create", {
        projectionPositions: positionData?.data?.positions,
        name: simulationName, tokenPositions,
        uid: uuidv4(),
        displayAddress,
        isPrivate,
        duration
      });
      document.cookie = `user_cookie=true;`;
      setLoading(false);
      props
        ?.setOpen(false);
      router.push(`simulation/view/${result.data.uid}`)
    } catch (error) {
      console.log(error)
      setLoading(false);
      setError('Something went wrong while API calling.')
    }
  };

  const handleClose = () => {
    setError(false);
  };

  const handlePrivate = (e) => {
    setIsPrivate(e.target.checked);
  }

  return (
    <>
      <Transition.Root show={props?.open} as={Fragment}>
        <Dialog as="div" className={`${theme} relative z-10 bg-primary`} onClose={props?.setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="bg-green-700 relative transform overflow-hidden rounded-lg card-dark px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <h2 className="text-white text-xl text-center mt-10">Create a simulation (Aave v3)</h2>
                  
                    <div>
                      <div className="mt-4">
                        <Input
                          value={simulationName}
                          onChange={handleName}
                          placeholder="Insert Simulation Name"
                        />
                      </div>
                      <div className="mt-4">
                        <Input
                          value={wallet}
                          onChange={handleWallet}
                          placeholder="Insert Wallet Address"
                        />
                      </div>
                     
                      <div className="mt-4">
                     
                        <Range title="Duration (days)" writable="true" className="mb-4" extRef={durationRef} handleValue={setDuration} value={duration} min="1" max="60" />
                      </div>
                      <div className="mt-4">
                        <Select
                          value={options.find(item => item.id === selectedMarket)}
                          options={options}
                          onChange={handleMarket}
                        />
                      </div>
                      <div className="mt-4">
                        <CheckButton checked={isPrivate} onChange={handlePrivate} label="Make it private" />
                      </div>
                      {error && <div className="bg-red-sizy/10 p-2 rounded text-red-sizy text-xs mt-2 flex justify-between items-center">
                        <p>{error}</p>
                        <span className="cursor-pointer" onClick={handleClose}>x</span>
                      </div>}
                    </div>
                    <div className="mt-10">
                      <button onClick={handleSubmit} className="flex w-full justify-center rounded-md border border-transparent bg-blue-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-han focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Submit
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ModalLoading open={loading} setOpen={setLoading} />
    </>
  );
}
