import {useEffect, useState} from 'react';

import {ArrowsUpDownIcon} from '@heroicons/react/20/solid';

import {DEFAULT_ASSETS} from '../../../utils/constants';

import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import SelectAssets from '../../../components/forms/SelectAssets';
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';
import ButtonText from "../../../components/buttons/ButtonText";
import NoborderInput from "../../../components/forms/inputs/NoborderInput";

const SwapWallet = (props) => {
    const {open, onClose} = props;
    const [tempLastHour, setTempLastHour] = useState('');
    const [asset1,
        setAsset1] = useState({id: '1232123', label: 'DAI'});
    const [asset2,
        setAsset2] = useState("");
    const [token1,
        setToken1] = useState(0);
    const [token2,
        setToken2] = useState(0);
    const [direction,
        setDirection] = useState(true);
    const [locked,
        setLocked] = useState('token1');
    const [valid,
        setValid] = useState(false);

    const onChangeToken1 = (e) => {
        setToken1(e.target.value)
    };

    const onChangeToken2 = (e) => {
        setToken2(e.target.value);
    };

    const onChangeAsset1 = (id) => {
        const selected = DEFAULT_ASSETS.find(item => item.id === id);
        setAsset1(selected)
    };

    const onChangeAsset2 = (id) => {
        const selected = DEFAULT_ASSETS.find(item => item.id === id);
        setAsset2(selected);
    };

    const onChangeDirection = () => {
        setDirection(state => !state);
        setAsset1(state => setAsset2(state));
        setAsset2(state => setAsset1(state));
        setToken1(state => setToken2(state));
        setToken2(state => setToken1(state));
        setLocked(state => {
            if (state === 'token1') {
                return 'token2'
            } else {
                return 'token1'
            }
        })
    };

    useEffect(() => {
        setValid(token1 && token2 && asset1 && asset2)
    }, [token1, token2, asset1, asset2])
    useEffect(() => {
        // Séparer les heures et les minutes en utilisant le caractère ':' comme séparateur
        const [hours, minutes] = lastHour.split(':').map(Number);
      
        // Ajouter une minute aux minutes
        const newMinutes = minutes + 1;
      
        // Calculer les heures et les minutes résultantes en tenant compte de tout dépassement
        const newHours = hours + Math.floor(newMinutes / 60);
        const finalMinutes = newMinutes % 60;
      
        // Formater la chaîne de temps résultante
        const tempTime = `${newHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
      
        // Stocker la chaîne de temps dans tempLastHour
        setTempLastHour(tempTime);
      }, [lastHour]);
      const handleLastHourChange = (e) => {
        setErrorText()
        const newLastHour = e.target.value;
        e.target.blur();
        const currentLastHourDate = new Date(`1970-01-01T${newLastHour}:00`);
        const previousLastHourDate = new Date(`1970-01-01T${lastHour}:00`);
        if (currentLastHourDate < previousLastHourDate) {
          setErrorText(`Time of your new action must be after the time of the last action at ${lastHour}`)
          setDisableBtn(true);
        }
        else {
          setTempLastHour(e.target.value);
          setDisableBtn(false);
        }  
      };
    return (
        <Modal open={open} onClose={onClose}>
            <div className='text-sm text-white'>
                Swap DAI (Wallet)
            </div>
            <div className="mt-4 flex justify-between gap-10">
                <DateSelect date={new Date(selectedDate)} className="w-1/2"/>
                <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
            </div>
            <div className="relative mt-4">
                <Item className="flex items-stretch justify-between">
                    <div className='flex flex-col justify-between'>
                        <NoborderInput
                            type="number"
                            value={token1}
                            placeholder={0}
                            onChange={onChangeToken1}/>
                        <div className="text-gray-light text-xs">$543.55</div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                        <SelectAssets
                            value={asset1}
                            onChange={onChangeAsset1}
                            locked={locked === 'token1'}/>
                        <div className="flex items-center justify-end gap-4 mt-1">
                            <div className="text-gray-light text-xs shrink-0">Balance: 10,52323</div>
                            <ButtonText text="Max"/>
                        </div>
                    </div>
                </Item>
                <div
                    onClick={onChangeDirection}
                    className='w-fit h-fit absolute left-0 right-0 top-0 bottom-0 m-auto cursor-pointer p-1 border-white border-2 border-opacity-20 rounded bg-blue-crayola hover:bg-blue-tiful'>
                    <ArrowsUpDownIcon
                        className={`text-white w-3 transition-all ${direction
                        ? "rotate-180"
                        : "rotate-0"}`}/>
                </div>
                <Item className="mt-4 flex items-stretch justify-between">
                    <div className='flex flex-col justify-between'>
                        <NoborderInput
                            type="number"
                            value={token2}
                            placeholder={0}
                            onChange={onChangeToken2}/>
                        <div className="text-gray-light text-xs">$543.55</div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                        <SelectAssets
                            value={asset2}
                            onChange={onChangeAsset2}
                            locked={locked === 'token2'}/>
                        <div className="flex items-center justify-end gap-4 mt-1">
                            <div className="text-gray-light  text-xs shrink-0">Balance: 0.00</div>
                            <ButtonText text="Max"/>
                        </div>
                    </div>
                </Item>
            </div>
            <div
                className={`${valid
                ? 'h-16'
                : 'h-0'} transition-height duration-500 overflow-hidden`}>
                <Item className="mt-4">
                    <div className="flex justify-between gap-4">
                        <div className="text-white text-sm">Health factor</div>
                        <div className="text-gray-light text-sm">3.4 &#62; 3.9</div>
                    </div>
                </Item>
            </div>
            <div className="w-full mt-4 flex justify-center gap-3">
                <ButtonOutlined
                    className={'w-[120px] py-2 px-5 text-xs'}
                    label="Cancel"
                    onClick={onClose}/>
                <ButtonFilled label="Swap" disabled={!valid}/>
            </div>
        </Modal>
    )
};

export default SwapWallet;