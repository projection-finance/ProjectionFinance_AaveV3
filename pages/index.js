import { useEffect, useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { EyeIcon } from '@heroicons/react/20/solid';
import MainLayout from "../layouts/mainLayout";
import ModalSelectWallet from "../components/modalSelectWallet";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import { formatMonthYearDate, milliToDateMilli } from "../utils/functions";

export default function Projections() {
  const router = useRouter();
  const [openWallets, setOpenWallets] = useState(false);
  const [publicSimulations, setPublicSimulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const getMarketInfo = (market) => {
    let marketName, gasToken, eModes;
  
    switch (market) {
      case "mainnet_v3":
        marketName = 'Ethereum';
        gasToken = 'ETH';
        eModes = ['Disabled', 'ETH correlated'];
        break;
      case "polygon_v3":
        marketName = 'Polygon';
        gasToken = 'MATIC';
        eModes = ['Disabled', 'Stablecoins', 'MATIC correlated'];
        break;
      case "fantom_v3":
        marketName = 'Fantom';
        gasToken = 'ETH';
        eModes = ['Disabled', 'Stablecoins'];
        break;
      case "arbitrum_v3":
        marketName = 'Arbitrum';
        gasToken = 'ETH';
        eModes = ['Disabled', 'Stablecoins', 'ETH correlated'];
        break;
      case "optimism_v3":
        marketName = 'Optimism';
        gasToken = 'ETH';
        eModes = ['Disabled', 'Stablecoins'];
        break;
      case "avalanche_v3":
        marketName = 'Avalanche';
        gasToken = 'AVAX';
        eModes = ['Disabled', 'Stablecoins', 'AVAX correlated'];
        break;
      case "harmony_v3":
        marketName = 'Harmony';
        gasToken = 'ONE';
        eModes = ['Disabled', 'Stablecoins'];
        break;
      default:
        marketName = 'Ethereum';
        gasToken = 'ETH';
        eModes = ['Disabled', 'ETH correlated'];
        break;
    }
  
    // Do something with the market info
    // For example, you can return an object containing the values
    return {
      marketName,
      gasToken,
      eModes,
    };
  };
 
  useEffect(() => {
    setLoading(true);
    axios.post("/api/simulation/read_all_public", { skip: 0 })
      .then(result => {
        setPublicSimulations(result.data)
        setLoading(false);
      })
  }, []);

  const handleView = (id) => {
    router.push(`/simulation/view/${id}/`)
  };

  const handlePage = (page) => {
    setPage(page)
  }

  return (
    <MainLayout>
      <div className="flex flex-row justify-between items-center mb-4">
        <button onClick={() => setOpenWallets(true)} className="px-4 text-sm cursor-pointer text-center font-medium font-inter py-2 rounded-md bg-blue-crayola text-white hover:bg-blue-tiful focus:outline-none focus:ring focus:ring-blue-tiful-300">
          Create Simulation
        </button>
      </div>

      <div className="mt-10">
        <div className="border-b mb-5 border-gray-700/50 my-2 px-4 py-2 grid grid-cols-12 ">
          <div className="text-gray-lighter col-span-2">Simulation Name</div>
          <div className="text-gray-lighter col-span-1">Market</div>
          <div className="text-gray-lighter col-span-5">Wallet Address</div>
          <div className="text-gray-lighter col-span-2">Start Date</div>
          <div className="text-gray-lighter col-span-1">Duration</div>
        </div>
        {loading ? <div className="w-10 h-10 mx-auto mt-20"><Loading /></div> :
          <>
            {publicSimulations.slice((page - 1) * 5, page * 5).map((item, index) => (
              
              <div key={index} className="border border-gray-700/50 rounded-md my-2 px-4 py-2 grid grid-cols-12 hover:cursor-pointer" onClick={() => handleView(item.uid)} >
                <div className="text-gray-lighter col-span-2">{item?.name || "-"}</div>
                <div className="text-gray-lighter col-span-1">{getMarketInfo(item?.projectionPositions.network).marketName}</div>
                <div className="text-gray-lighter col-span-5">{item?.displayAddress}</div>
                <div className="text-gray-lighter col-span-2">{formatMonthYearDate(milliToDateMilli(new Date(item?.createdAt))) || "-"}</div>
                <div className="text-gray-lighter col-span-1">{item?.duration || "-"} days</div>
              </div>
            ))}
            <div className="w-full flex justify-center mt-10">
              {publicSimulations?.length > 5 && <Pagination data={publicSimulations} total={Math.ceil(publicSimulations?.length / 5)} page={page} onPageChange={handlePage} />}
            </div>
          </>
        }
      </div>

      <ModalSelectWallet open={openWallets} setOpen={setOpenWallets} />
    </MainLayout>
  );
}

