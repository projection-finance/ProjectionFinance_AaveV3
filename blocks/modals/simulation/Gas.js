import { useEffect, useState } from 'react';
import _ from 'lodash';
import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonText from "../../../components/buttons/ButtonText";
import DateSelect from "../../../components/forms/dateInput/DateSelect";
import TimeInput from "../../../components/forms/TimeInput";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import NoborderInput from "../../../components/forms/inputs/NoborderInput";
import { Formator } from '../../../utils/formator';
import Maths from "../../../utils/maths";
import AaveOffline from "../../../service/aave_offline";
import uniqid from 'uniqid';
const aaveOffline = new AaveOffline();
const Gas = (props) => {
  
    const { open, onClose, gasToken, averageGasPerAction, setAverageGasPerAction} = props;
   
    const [tempAverageGasPerAction, setTempAverageGasPerAction] = useState('');

    const submitGas = () => {
      setAverageGasPerAction(tempAverageGasPerAction);
      onClose();
    }
    const onChangeGasPerAction = (e) => {
      setTempAverageGasPerAction(e.target.value);
    };
    const onCloseClean = () => {
      setTempAverageGasPerAction(averageGasPerAction);
      onClose();
    };

    useEffect(() => {
      setTempAverageGasPerAction(averageGasPerAction);
  }, [averageGasPerAction]);



    return ( <Modal open={open} onClose={onCloseClean} className='bg-blue-gray'>
   
      <>
        <div className='text-sm text-white'>
        Average Gas price per action {gasToken}
        </div>
       
        <Item className="mt-4">
          <div className="flex items-center justify-between">
            <div className="w-2/3">
              <NoborderInput
               value={tempAverageGasPerAction}
                placeholder={0.01}
                type="number"
                onChange={onChangeGasPerAction}
              />
            </div>
            
          </div>
        </Item>
        <div className="w-full mt-4 flex justify-center gap-3">
          <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose} />
          <ButtonFilled label="Submit" onClick={submitGas} />
        </div>
      </>
  </Modal>
    )
};
export default Gas;