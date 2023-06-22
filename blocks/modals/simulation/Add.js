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
const Add = (props) => {
  
    const { open, onClose, modalData, selectedDate, userSummary, simulationData, rangeValue, setSimulationActions, simulationActions, lastHour = '00:10', setLastHour} = props;
    const [tempLastHour, setTempLastHour] = useState('');
    const [amount, setAmount] = useState(0);
    const pointData = simulationData[rangeValue];

    const [errorText, setErrorText] = useState('');
    const [disableBtn, setDisableBtn] = useState(true);
    const [usageAsCollateralEnabledOnUser,setUsageAsCollateralEnabledOnUser] = useState(true);

    
    const onChangeAmount = (e) => {
        setAmount(e.target.value);
    };
    const onSetMaxAmount = () => {
        
        setAmount(Number(modalData.availableToDeposit));
    }
    const submitAdd = () => {
        const wrapped = false;
        if(modalData.symbol == 'ETH' || modalData.symbol == 'AVAX' || modalData.symbol == 'MATIC' || modalData.symbol == 'ONE'){
          //todo for each chain token
            wrapped = true;
        }
        if (lastHour != null && typeof lastHour !== 'undefined') {
          var actionSeconds = Formator.convertTimeToSeconds(tempLastHour);
        } else {
          var actionSeconds = null; // ou une valeur par défaut si nécessaire
        }
        let actionId = uniqid();
        const indexPoints = rangeValue;
        
        const newAction = {
            id: actionId,
            action: {
                type: 'add',
                token_a: modalData.symbol,
                token_a_qty: amount,
                wrapped: wrapped
            },

            actionName: `Add ${modalData.symbol} to your wallet balance`,
            actionDetails: `${Number(amount).truncateDecimals(4)} ${modalData.symbol}`,
            actionSeconds: actionSeconds
        };
        if (!simulationActions) {
            const baseSimulationActions = {
                indexPoints: {
                    [indexPoints]: {
                        actions: [newAction],
                    },
                },
            };
            setSimulationActions(baseSimulationActions);
        } else {
            if (simulationActions && simulationActions.indexPoints && simulationActions.indexPoints[indexPoints]?.actions) {
                // Add newAction to the existing actions array using setSimulationActions
                setSimulationActions({
                    ...simulationActions,
                    indexPoints: {
                        ...simulationActions.indexPoints,
                        [indexPoints]: {
                            ...simulationActions.indexPoints[indexPoints],
                            actions: [
                                ...simulationActions.indexPoints[indexPoints].actions,
                                newAction,
                            ],
                        },
                    },
                });
            } else {
                // Create simulationActions.indexPoints[indexPoints] and simulationActions.indexPoints[indexPoints].actions, then push newAction using setSimulationActions
                setSimulationActions({
                    ...simulationActions,
                    indexPoints: {
                        ...simulationActions.indexPoints,
                        [indexPoints]: {
                            actions: [newAction],
                        },
                    },
                });
            }
        }

        setLastHour(tempLastHour)
      };
    useEffect(() => {
        setAmount(0);
    }, [modalData]);

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
    useEffect(() => {
      if(amount > 0){
        setDisableBtn(false)
      }
  }, [amount]);
    return ( <Modal open={open} onClose={onClose} className='bg-blue-gray'>
    {modalData && (
      <>
        <div className='text-sm text-white'>
          Add {modalData.symbol} to your wallet balance
        </div>
        <div className="mt-4 flex justify-between gap-10">
        <DateSelect date={new Date(selectedDate)} className="w-1/2" />
        <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
        </div>
        <Item className="mt-4">
          <div className="flex items-center justify-between">
            <div className="w-2/3">
              <NoborderInput
                value={amount}
                placeholder={0}
                type="number"
                onChange={onChangeAmount}
              />
            </div>
            <div className="w-1/3">
              <div className="text-white text-lg text-end font-bold">
                ${(amount * modalData.priceInUSD).truncateDecimals(2)}
              </div>
              
            </div>
          </div>
        </Item>
        <Item className="mt-4">
          
          <div className="flex justify-between mb-6">
            <div className="text-white text-sm">Health factor</div>
            <div className="text-gray-light text-sm">
              {Number(userSummary.healthFactor).truncateDecimals(2)} &gt; {Number(userSummary.healthFactor).truncateDecimals(2)}
            </div>
          </div>
        </Item>
        <div className='text-sm text-red-shimmer mt-2'>{errorText}</div>
        <div className="w-full mt-4 flex justify-center gap-3">
          <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose} />
          <ButtonFilled label="Add" disabled={disableBtn} onClick={submitAdd} />
        </div>
      </>
    )}
  </Modal>
    )
};
export default Add;