import { useState } from 'react';

import { DEFAULT_ASSETS } from "../../../utils/constants";

import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import SelectAssets from "../../../components/forms/SelectAssets";
import NoborderInput from "../../../components/forms/inputs/NoborderInput";

const ReceiveAddTokens = (props) => {
  const { open, onClose } = props;

  const [asset, setAsset] = useState("");
  const [amount, setAmount] = useState(0);

  const onChangeAsset = (id) => {
    const selected = DEFAULT_ASSETS.find(item => item.id === id);
    setAsset(selected);
  };

  const onChangeAmount = (e) => { 
    setAmount(e.target.value);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className='text-sm text-white'>
        Receive (add) Tokens
      </div>
      <Item className="mt-4 flex justify-between items-center">
        <div>
          <NoborderInput type="number" value={amount} placeholder={0} onChange={onChangeAmount} />
          <div className="text-gray-light text-xs">$543.55</div>
        </div>
        <SelectAssets value={asset} onChange={onChangeAsset} />
      </Item>
      <div className="w-full mt-8 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose}/>
        <ButtonFilled label="Claim" />
      </div>
    </Modal>
  )
};

export default ReceiveAddTokens;