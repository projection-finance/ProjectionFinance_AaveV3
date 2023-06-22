import { useState } from "react";
import MainLayout from "../layouts/mainLayout";
import ModalSelectWallet from "../components/modalSelectWallet";


export default function Projections() {
  const [openWallets, setOpenWallets] = useState(true);

  return (
    <MainLayout>
      <div className="flex flex-row justify-between items-center mb-4">
        <button onClick={() => setOpenWallets(true)} className="px-4 text-sm cursor-pointer text-center font-medium font-inter py-2 rounded-md bg-blue-crayola text-white hover:bg-blue-tiful focus:outline-none focus:ring focus:ring-blue-tiful-300">
          Create Simulation
        </button>
      </div>
      
      <ModalSelectWallet open={openWallets} setOpen={setOpenWallets} />
    </MainLayout>
  );
}

