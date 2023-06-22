import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonText from "../../../components/buttons/ButtonText";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';
import NoborderInput from "../../../components/forms/inputs/NoborderInput";
import { Formator } from "../../../utils/formator";
import Maths from "../../../utils/maths";
import AaveOffline from "../../../service/aave_offline";
import uniqid from 'uniqid';
const aaveOffline = new AaveOffline();
const Withdraw = (props) => {
  const { open, onClose, modalData, selectedDate, userSummary, simulationData, rangeValue, setSimulationActions, simulationActions, lastHour = '00:10', setLastHour} = props;
  const [tempLastHour, setTempLastHour] = useState('');
  const [amount, setAmount] = useState(0);
  const pointData = simulationData[rangeValue];
  const [possibleHealthFactor, setPossibleHealthFactor] = useState('?');
  const [errorText, setErrorText] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const submitWithdraw = () => {
    let actionId = uniqid();
    const indexPoints = rangeValue;
    if (lastHour != null && typeof lastHour !== 'undefined') {
      var actionSeconds = Formator.convertTimeToSeconds(tempLastHour);
    } else {
      var actionSeconds = null; // ou une valeur par défaut si nécessaire
    }
    const newAction = {
        id: actionId,
        action: {
          type: 'withdraw',
          token_a: modalData.reserve.symbol,
          token_a_qty: amount,
      },
      actionName: `Withdraw ${modalData.reserve.symbol}`,
      actionDetails: `${amount} ${modalData.reserve.symbol}`,
      actionSeconds: actionSeconds
    };
    console.log(newAction,'newAction');
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
  const calculatePossibleHealthFactor = (amount) => {
        setErrorText('')
        setPossibleHealthFactor('?');
        if (selectedDate != 0) { //todo : if HOUR is not selected
            if (amount > 0) {
                setDisableBtn(false);
                if (pointData && pointData.userProjection != undefined) {
                    if (amount > Number(modalData?.underlyingBalance)) {
                        console.log(amount,Number(modalData?.underlyingBalance),'x > b')
                        setErrorText("Amount too high for your balance")
                        setDisableBtn(true);
                    }
                    else {
                      //Change value to simulate & get the possible healthfactor !
                      const pointDataUserProjection = _.cloneDeep(pointData.userProjection);
                      console.log(pointDataUserProjection,'maxime pointdata');
                      switch(modalData.symbol) {
                        case 'ETH':
                          var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === 'WETH');
                          break;
                        case 'MATIC':
                          var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === 'MATIC');
                          break;
                        case 'AVAX':
                          
                          var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === 'WAVAX');
                          break;
                        case 'ONE':
                          var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === 'WONE');
                          break;
                        default:
                        
                          var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === modalData.reserve.symbol);
                          // Action à effectuer si modalData.symbol ne correspond à aucun des cas précédents
                      }
                      
                      console.log(matchingReserve,'maxime matching');
                      console.log(pointDataUserProjection.reserve,'maxime zouzou')
                      let baseScaledATokenBalance = matchingReserve.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                      let liquidityIndex = matchingReserve.reserve.liquidityIndex / Math.pow(10, 27);
                      let qty = amount;
                      let qtyScaled = qty * liquidityIndex;
                      let finalScaledATokenBalance = baseScaledATokenBalance - qtyScaled;
                      matchingReserve.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserve.reserve.decimals);
                      let healthFactor = aaveOffline.getUserSummary(pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId).healthFactor;
                      console.log(healthFactor, 'healthFactor')
                    let possible = Number(healthFactor).truncateDecimals(2);
                    if(possible < 1.01){
                      setErrorText("Health Factor too low, < 1 = liquidation risk")
                      setDisableBtn(true);
                    }
                    setPossibleHealthFactor(possible);
                    }
                }
            }
        } 
    }
  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };
  const onSetMaxAmount = () => {
    setAmount(Number(modalData.underlyingBalance).truncateDecimals(5));
  }
  useEffect(() => {
    setAmount(0);
  }, [modalData])
  useEffect(() => {
    calculatePossibleHealthFactor(amount)
    if (amount === null || amount <= 0) {
      setDisableBtn(true);
    }
}, [amount]);
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
      {modalData && <>
        <div className='text-sm text-white'>
          Withdraw {modalData.reserve.symbol}
        </div>
        <div className="mt-4 flex justify-between gap-10">
          <DateSelect date={new Date(selectedDate)} className="w-1/2" />
          <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
        </div>
        <Item className="mt-4">
          <div className="flex items-center justify-between">
            <div className="w-2/3">
              <NoborderInput value={amount} placeholder={0} onChange={onChangeAmount} />
              <div className="flex justify-start items-center gap-4 mt-2.5">
                <div className="text-gray-light text-sm">Balance {Formator.formatNumber(modalData.underlyingBalance)}</div>
                <ButtonText text="Max" onClick={()=>onSetMaxAmount()}/>
              </div>
            </div>
            <div className="w-1/3">
              <div className="text-white text-lg text-end font-bold">${(amount * modalData.reserve.priceInUSD).truncateDecimals(5)}</div>
              <div className="text-gray-light text-sm text-end mt-2.5">${Formator.formatNumber((Number(modalData.underlyingBalance).truncateDecimals(5) * modalData.reserve.priceInUSD).truncateDecimals(5))}</div>
            </div>
          </div>
        </Item>
        <Item className="mt-4">
          <div className="flex justify-between">
            <div className="text-white text-sm">Health factor</div>
            <div className="text-gray-light text-sm">{Number(userSummary.healthFactor).truncateDecimals(2)} &#62; {possibleHealthFactor}</div>
          </div>
        </Item>
        <div className='text-sm text-red-shimmer mt-2'>{errorText}</div>
        <div className="w-full mt-4 flex justify-center gap-3">
          <ButtonOutlined className={'py-2 px-5 text-xs w-[120px]'} label="Cancel" onClick={onClose} />
          <ButtonFilled disabled={disableBtn} label="Withdraw" onClick={submitWithdraw} />
        </div>
      </>}
    </Modal>
  )
};
export default Withdraw;