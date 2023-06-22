import { useEffect, useState } from 'react';

import { DEFAULT_ASSETS } from "../../utils/constants";

import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import SelectAssets from "../../../components/forms/SelectAssets";
import NoborderInput from "../../../components/forms/inputs/NoborderInput";
import ButtonText from '../../../components/buttons/ButtonText';

const SendWithdrawTokens = (props) => {
  const { open, onClose } = props;

  const [asset, setAsset] = useState("");
  const [amount, setAmount] = useState(0);
  const [disabled, setDisabled] = useState(true);

  const onChangeAsset = (id) => {
    const selected = DEFAULT_ASSETS.find(item => item.id === id);
    setAsset(selected);
  };

  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  useEffect(() => {
    setDisabled(!(amount && asset))
  }, [amount, asset]);

  const onWithdraw = () => {
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className='text-sm text-white'>
        Send (withdraw) tokens
      </div>
      <Item className="mt-4 flex justify-between items-stretch">
        <div className='flex flex-col justify-between items-start'>
          <NoborderInput type="number" value={amount} placeholder={0} onChange={onChangeAmount} />
          <div className="text-gray-light text-xs">$543.55</div>
        </div>
        <div className='flex flex-col justify-between items-end'>
          <SelectAssets value={asset} onChange={onChangeAsset} />
          <div className='flex items-center justify-end gap-4'>
            <div className='text-gray-light text-xs'>Balance: 12,2343.33</div>
            <ButtonText text="Max" />
          </div>
        </div>
      </Item>
      <div className="w-full mt-8 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose}/>
        <ButtonFilled label="Withdraw" disabled={disabled} onClick={onWithdraw} />
      </div>
    </Modal>
  )
};

export default SendWithdrawTokens;