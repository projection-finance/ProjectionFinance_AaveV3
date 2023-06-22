import { useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import ButtonText from "../../../components/buttons/ButtonText";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import NoborderInput from "../../../components/forms/inputs/Input";
import RadioButton from "../../../components/forms/RadioButton";
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';
import { Formator } from '../../../utils/formator';
import AaveOffline from "../../../service/aave_offline";
import uniqid from 'uniqid';
const aaveOffline = new AaveOffline();
import Maths from "../../../utils/maths";
const Borrow = (props) => {
  const { open, onClose, modalData, selectedDate, userSummary, simulationData, rangeValue, setSimulationActions, simulationActions, lastHour = '00:10', setLastHour} = props;
  const [tempLastHour, setTempLastHour] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState('variable');
  const pointData = simulationData[rangeValue];
  const [possibleHealthFactor, setPossibleHealthFactor] = useState('?');
  const [errorText, setErrorText] = useState('');
  const [disableBtn, setDisableBtn] = useState(true);
  const [usageAsCollateralEnabledOnUser,setUsageAsCollateralEnabledOnUser] = useState(true);
  const submitBorrow = () => {
    const wrapped = false;
    switch(modalData.symbol) {
      case 'ETH':
        modalData.symbol = 'WETH';
        wrapped = true;
        break;
      case 'MATIC':
        modalData.symbol = 'MATIC';
        wrapped = true;
        break;
      case 'AVAX':
        modalData.symbol = 'WAVAX';
        wrapped = true;
        break;
      case 'ONE':
        modalData.symbol = 'WONE';
        wrapped = true;
        break;
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
            type: 'borrow',
            wrapped: wrapped,
            type_borrow: type,
            token_a: modalData.symbol,
            token_a_qty: amount,
        },

        actionName: `Borrow ${modalData.symbol} (${type})`,
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
  const calculatePossibleHealthFactor = (amount) => {
    setErrorText('')
    setPossibleHealthFactor('?');
    if (selectedDate != 0) { //todo : if HOUR is not selected
        if (amount > 0) {
            setDisableBtn(false);
            if (pointData && pointData.userProjection != undefined) {
                if (amount > Number(modalData?.availableBorrows)) {
                    setErrorText("Amount too high for your balance")
                    setDisableBtn(true);
                }
                else {
                  //Change value to simulate & get the possible healthfactor !
  
                  const pointDataUserProjection = _.cloneDeep(pointData.userProjection)
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
                      var matchingReserve = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === modalData.symbol);
                      // Action à effectuer si modalData.symbol ne correspond à aucun des cas précédents
                  }
                  

                  console.log(matchingReserve,'matchingReserve abc');

                  
                  if(type == 'variable'){
                    //variable
                    let baseScaledVariableDebt = matchingReserve.scaledVariableDebt / Math.pow(10, matchingReserve.reserve.decimals);
                  let variableBorrowIndex = matchingReserve.reserve.variableBorrowIndex / Math.pow(10, 27);
                  let qty = amount;
                  let qtyScaled = qty * variableBorrowIndex
                  let finalScaledVariableDebt = baseScaledVariableDebt + qtyScaled;
                  matchingReserve.scaledVariableDebt = finalScaledVariableDebt * Math.pow(10, matchingReserve.reserve.decimals);
                  }
                  else {
                    //stable apy ! test it !
                  let baseScaledATokenBalance = matchingReserve.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                  let qty = amount;
                  let finalATokenBalance = baseScaledATokenBalance + qty;
                  matchingReserve.scaledATokenBalance = finalATokenBalance * Math.pow(10, matchingReserve.reserve.decimals);
                  }
                  
                  
                  
                  let healthFactor = aaveOffline.getUserSummary(pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId).healthFactor;
                  console.log(healthFactor, 'healthFactor')
                setPossibleHealthFactor(Number(healthFactor).truncateDecimals(2));

                }
                
            }
        }
    } 
}
  const onChangeAmount = (e) => {
    setAmount(e.target.value);
  };
  const onChangeType = (e) => {
    setType(e.target.value);
  }
  const onSetMaxAmount = () => {
    console.log(modalData,'modal maxime');
    setAmount(Number(modalData.availableBorrows));
}
  useEffect(() => {
    setAmount(0);
    setType('variable');
    console.log(modalData,'modal maxime');
  }, [modalData])
  useEffect(() => {
    calculatePossibleHealthFactor(amount)
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
          Borrow {modalData.reserve.symbol}
        </div>
        <div className="mt-4 flex justify-between gap-10">
        <DateSelect date={new Date(selectedDate)} className="w-1/2" />
        <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
        </div>
        <Item className="mt-4">
          <div className="flex items-center justify-between">
            <div className="w-2/3">
              <NoborderInput value={amount} placeholder={0} onChange={onChangeAmount} type="number"/>
              <div className="flex justify-start items-center gap-4 mt-2.5">
                <div className="text-gray-light text-sm">Available {Number(modalData.availableBorrows).truncateDecimals(3)}</div>
                <ButtonText
                  text="Max"
                  onClick={() => onSetMaxAmount()}
                />
              </div>
            </div>
            <div className="w-1/3">
              <div className="text-white text-lg text-end font-bold"> ${(amount * modalData.priceInUSD).truncateDecimals(2)} </div>
              <div className="text-gray-light text-sm text-end mt-2.5">${Formator.formatNumber(Number(modalData.availableBorrowsInUSD
).truncateDecimals(3))}</div>
            </div>
          </div>
        </Item>
        <div className="mt-4 flex items-center">
        
      <RadioButton
        className="w-1/2"
        label={`Variable ${Number(modalData.variableBorrowAPY*100).truncateDecimals(2)} %`}
        value="variable"
        checked={type === 'variable'}
        onChange={onChangeType}
      />
      {modalData?.stableBorrowRateEnabled ? (
        <RadioButton
          className="w-1/2"
          label={`Fixed ${Number(modalData.stableBorrowAPY*100).truncateDecimals(2)} %`}
          value="fixed"
          checked={type === 'fixed'}
          onChange={onChangeType}
        />
      ) : null}
    
          
        </div>
        <Item className="mt-4">
          <div className="flex justify-between">
            <div className="text-white text-sm">Health factor</div>
            <div className="text-gray-light text-sm">{Number(userSummary.healthFactor).truncateDecimals(2)} &#62; {possibleHealthFactor}</div>
          </div>
        </Item>
        <div className='text-sm text-red-shimmer mt-2'>{errorText}</div>
        <div className="w-full mt-4 flex justify-center gap-3">
          <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose} />
          <ButtonFilled label="Borrow" disabled={disableBtn} onClick={submitBorrow} />
        </div>
      </>}
    </Modal>
  )
};
export default Borrow;