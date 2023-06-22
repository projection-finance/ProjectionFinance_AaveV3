import { useState,useEffect,useRef } from 'react';
import { Formator } from '../../../utils/formator';
import Maths from "../../../utils/maths";
import AaveOffline from "../../../service/aave_offline";
import uniqid from 'uniqid';
const aaveOffline = new AaveOffline();
import Modal from "../../../components/Modal";
import ButtonText from "../../../components/buttons/ButtonText";
import Item from "../../../components/Item";
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import NoborderInput from "../../../components/forms/inputs/NoborderInput";
import Input from '../../../components/forms/inputs/Input';
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';
import SelectAssets from '../../../components/forms/selects/SelectAssets';
import ButtonsGroup from '../../../components/buttons/ButtonsGroup';
import { Tab } from '@headlessui/react';
const Repay = (props) => {
  const { open, onClose, modalData, selectedDate, userSummary, assetsToSupply, userEmodeCategoryId, simulationData, rangeValue, setSimulationActions, simulationActions, typeBorrow, lastHour = '00:10', setLastHour} = props;

  console.log(assetsToSupply,'assetsToSupply abc!')
    const [tempLastHour, setTempLastHour] = useState('');
    const AssetsRepayWith = [];
    const [amount, setAmount] = useState(0);
    const pointData = simulationData[rangeValue];
    const [possibleHealthFactor, setPossibleHealthFactor] = useState('?');
    const [errorText, setErrorText] = useState('');
    const [disableBtn, setDisableBtn] = useState(true);
    const [usageAsCollateralEnabledOnUser,setUsageAsCollateralEnabledOnUser] = useState(true);
    const [borrowMaxBalance,setBorrowMaxBalance] = useState(Number(modalData?.stableBorrows+modalData?.variableBorrows))
    const [qtyToRepay,setQtyToRepay] = useState(0)
    const [newQtyBorrow,setNewQtyBorrow] = useState(0)
    const [qtySwitchRepay,setQtySwitchRepay] = useState(0)
  const [totalBorrowsStableORVariable, setTotalBorrowsStableORVariable] = useState(null);
  const [totalBorrowsStableORVariableUSD, setTotalBorrowsStableORVariableUSD] = useState(null);

  
  useEffect(() => {
    if (modalData && modalData.variableBorrows != null) {
      if (typeBorrow === 'variable') {
        setTotalBorrowsStableORVariable(modalData.variableBorrows);
        setTotalBorrowsStableORVariableUSD(modalData.variableBorrowsUSD);
      } else if (typeBorrow === 'stable') {
        setTotalBorrowsStableORVariable(modalData.stableBorrows);
        setTotalBorrowsStableORVariableUSD(modalData.stableBorrowsUSD);
      }
    }
  }, [modalData, typeBorrow]);
  const calculatePossibleHealthFactor = (newQtyBorrow) => {
    setErrorText('')
    setPossibleHealthFactor('?');
        if (newQtyBorrow > 0) {
            setDisableBtn(false);
            if (pointData && pointData.userProjection != undefined) {
                if (newQtyBorrow > Number(totalBorrowsStableORVariable)) {
                    setErrorText("Error")
                    setDisableBtn(true);
                }
                else {
                  //Change value to simulate & get the possible healthfactor !
                  const pointDataUserProjection = _.cloneDeep(pointData.userProjection)
                  switch(modalData.reserve.symbol) {
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
                      // Action à effectuer si modalData.reserve.symbol ne correspond à aucun des cas précédents
                  }

                  let variableIndex = matchingReserve.reserve.variableBorrowIndex / Math.pow(10, 27);
                  let qtyVariable = newQtyBorrow * variableIndex;
                  let qtyFinal = qtyVariable * Math.pow(10, matchingReserve.reserve.decimals);
                  
                  
                  if(typeBorrow == 'stable'){
                    matchingReserve.principalStableDebt = newQtyBorrow * Math.pow(10, matchingReserve.reserve.decimals);
                  }
                  else {
                    matchingReserve.scaledVariableDebt = qtyFinal;
                  }

                  if(activeTab === 0){
                    //collateral
                 

                    var matchingReserveRepayWith = pointDataUserProjection.reserve.find(reserveData => reserveData.reserve.symbol === asset.symbol);

                      console.log(pointDataUserProjection,matchingReserveRepayWith,'matchingReserveRepayWith abc');

                      let baseScaledATokenBalance = matchingReserveRepayWith.scaledATokenBalance / Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                      let liquidityIndex = matchingReserveRepayWith.reserve.liquidityIndex / Math.pow(10, 27);
                      let qty = qtySwitchRepay;
                      let qtyScaled = qty * liquidityIndex;
                      let finalScaledATokenBalance = baseScaledATokenBalance - qtyScaled;
                      matchingReserveRepayWith.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                  }
                  else {
                    //wallet nothing to do here but in simulationId yes
                    
                  }
                  let healthFactor = aaveOffline.getUserSummary(pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId).healthFactor;

                  console.log(healthFactor,pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId, 'healthFactor')

                  console.log(aaveOffline.getUserSummary(pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId),'fraude')


                setPossibleHealthFactor(Number(healthFactor).truncateDecimals(2));
                }
            }
    } 
}
const submitRepay = () => {
  let actionId = uniqid();
  let symbolB = asset.symbol;

  let fromB = activeTab === 0 ? 'collateral' : 'wallet';
  const indexPoints = rangeValue;
  if (lastHour != null && typeof lastHour !== 'undefined') {
    var actionSeconds = Formator.convertTimeToSeconds(tempLastHour);
  } else {
    var actionSeconds = null; // ou une valeur par défaut si nécessaire
  }
  const newAction = {
      id: actionId,
      action: {
          type: 'repay',
          typeBorrow: typeBorrow,
          token_a: modalData.reserve.symbol,
          token_a_qty: newQtyBorrow,
          token_b: symbolB,
          token_b_qty: qtyToRepay,
          token_b_from: fromB
      },
      actionName: `Repay ${modalData.reserve.symbol} with ${symbolB} (${fromB })`,
      actionDetails: `Repay ${Number(amount).truncateDecimals(4)} ${modalData.reserve.symbol} with ${qtyToRepay} ${symbolB}`,
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
    const onChangeAmount = (e) => {
      setAmount(Number(e.target.value).truncateDecimals(4));
      setAsset();
      setQtyToRepay()
      setNewQtyBorrow()
      setQtyToRepay(0)
  };
  const onSetMaxAmount = () => {
      if(amount != Number(totalBorrowsStableORVariable).truncateDecimals(4)){
        setAmount(Number(totalBorrowsStableORVariable).truncateDecimals(4));
        setAsset();
        setQtyToRepay()
        setNewQtyBorrow()
        setQtyToRepay(0)
      }
  }
userSummary?.userReservesData.map((userReserveData, indexData) => {
  if (userReserveData.underlyingBalance > 0) {
    AssetsRepayWith.push({
      id: AssetsRepayWith.length + 1,
      key: 0, // collateral
      icon: userReserveData.reserve.iconSymbol,
      symbol: userReserveData.reserve.symbol,
      qty: Number(userReserveData.underlyingBalance).truncateDecimals(8),
      priceInUSD: userReserveData.reserve.priceInUSD
    });
  }
});
assetsToSupply?.map((asset, index) => {
  //adapt with all wrapped 
  let currentSymbol = modalData?.reserve?.symbol;
  if (asset.availableToDeposit > 0  )  {
    AssetsRepayWith.push({
      id: AssetsRepayWith.length + 1,
      key: 1, // assets to supply
      icon: asset.iconSymbol,
      symbol: asset.symbol,
      qty:  Number(asset.availableToDeposit).truncateDecimals(8),
      priceInUSD: asset.priceInUSD
    });
  }
});
const collateralAssetsRepayWith = AssetsRepayWith.filter(asset => asset.key === 0);
const walletAssetsRepayWith = AssetsRepayWith.filter(asset => asset.key === 1);
  const [activeTab, setActiveTab] = useState(0);
  const [asset, setAsset] = useState("");
  const onChangeAsset = (id) => {
    const selected = AssetsRepayWith.find(item => item.id === id);
    setAsset(selected);
    if(activeTab == '1'){

      let selectedQty = selected.qty;
      let selectedPriceInUSD = selected.priceInUSD;
      let totalSelectedInUSD = selectedQty*selectedPriceInUSD;
      let selectedInTokenAQty = totalSelectedInUSD/modalData?.reserve.priceInUSD;


      if(selectedInTokenAQty > amount){
        setQtyToRepay(Number(amount))
        setNewQtyBorrow(Number(totalBorrowsStableORVariable-amount))
      }
      else {
        setQtyToRepay(Number(selected.qty))
        setNewQtyBorrow(Number(totalBorrowsStableORVariable-selectedInTokenAQty))
      }
    }
    else {
      let maxInUSD = amount * modalData?.reserve.priceInUSD;
      let selectedQty = selected.qty;
      let selectedPriceInUSD = selected.priceInUSD;
      let maxQty = Math.min(maxInUSD / selectedPriceInUSD, selectedQty); 
      let maxQtyUSD = maxQty * selectedPriceInUSD;
      let newQtySwitchRepay = maxQtyUSD / modalData?.reserve.priceInUSD;
      setQtySwitchRepay(newQtySwitchRepay);
      setQtyToRepay(Number(maxQty.truncateDecimals(4)))
      setNewQtyBorrow(Number(totalBorrowsStableORVariable-newQtySwitchRepay))
    }
  };
  const Tabs = [
    {
      key: 0,
      label: "Collateral"
    },
    {
      key: 1,
      label: "Wallet"
    }
  ];
  const onChangeTab = (id) => {
    setActiveTab(id)
    setAsset();
    setNewQtyBorrow()
    setQtyToRepay(0)
  };
  useEffect(() => {
    calculatePossibleHealthFactor(newQtyBorrow)
}, [newQtyBorrow]);

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
  if (currentLastHourDate <= previousLastHourDate) {
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
        Repay {modalData?.reserve?.symbol}
      </div>
      <div className="mt-4 flex justify-between gap-10">
        <DateSelect date={new Date(selectedDate)} className="w-1/2" />
        <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
      </div>
      <div className='mt-4 flex justify-start items-center gap-5'>
        <div className='text-sm text-gray-light'>Repay with</div>
        <ButtonsGroup tabs={Tabs} active_tab={activeTab} onChange={onChangeTab} />
      </div>
      <div className='mt-4 flex justify-start items-center gap-5'>
        <div className='text-sm text-gray-light'>Expected amount to repay ({modalData?.reserve.symbol})</div>
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
              <div className="flex justify-start items-center gap-4 mt-2.5">
                <div className="text-gray-light text-sm">
                  Borrow balance {Number(totalBorrowsStableORVariable).truncateDecimals(4)}
                </div>
                <ButtonText
                  text="Max"
                  onClick={() => onSetMaxAmount()}
                />
              </div>
            </div>
            <div className="w-1/3">
              <div className="text-white text-lg text-end font-bold">
                $ {Number(amount * modalData?.reserve.priceInUSD).truncateDecimals(2)}
              </div>
              <div className="text-gray-light text-sm text-end mt-2.5">
                $ {Number(totalBorrowsStableORVariableUSD).truncateDecimals(2)}
              </div>
            </div>
          </div>
        </Item>
        <div className='mt-4 flex justify-start items-center gap-5'>
        <div className='text-sm text-gray-light'>Asset to repay with {asset?.symbol ? `(${asset.symbol})` : ''}</div>
      </div>
      {activeTab === 0 && (
        <>
          <Item className="mt-4 flex items-center gap-4">
            <div className='grow flex justify-between'>
              <Input className="text-white text-lg text-end font-bold" value={qtyToRepay} readonly/>
            </div>
            <SelectAssets options={collateralAssetsRepayWith} value={asset} onChange={onChangeAsset} className="w-36 shrink-0" />
          </Item>
          <Item className="mt-4">
            <div className="">
              <div className="flex justify-between gap-4">
                <div className="text-white text-sm">Remaining {modalData?.reserve.symbol} debt</div>
                <div className="text-gray-light text-sm">{Number(totalBorrowsStableORVariable).truncateDecimals(4)} &#62; {newQtyBorrow?.truncateDecimals(4)}</div>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <div className="text-white text-sm">Health Factor</div>
                <div className="text-gray-light text-sm text-end">{Number(userSummary?.healthFactor).truncateDecimals(2)} &#62; {possibleHealthFactor}</div>
              </div>
            </div>
          </Item>
        </>
      )}
      {activeTab === 1 && (
        <>
          <Item className="mt-4 flex items-center gap-4">
            <div className='grow flex justify-between'>
            <Input className="text-white text-lg text-end font-bold" value={qtyToRepay} readonly/>
            </div>
            <SelectAssets options={walletAssetsRepayWith} value={asset} onChange={onChangeAsset} className="w-36 shrink-0" />
          </Item>
          <Item className="mt-4">
            <div className="">
              <div className="flex justify-between gap-4">
              <div className="text-white text-sm">Remaining {modalData?.reserve.symbol} debt </div>
              <div className="text-gray-light text-sm">{Number(totalBorrowsStableORVariable).truncateDecimals(4)} &#62; {newQtyBorrow?.truncateDecimals(4)}</div>
              </div>
              <div className="flex justify-between gap-4 mt-4">
                <div className="text-white text-sm">Health Factor</div>
                <div className="text-gray-light text-sm text-end">{Number(userSummary?.healthFactor).truncateDecimals(2)} &#62; {possibleHealthFactor}</div>
              </div>
            </div>
          </Item>
        </>
      )}
      <div className='text-sm text-red-shimmer mt-2'>{errorText}</div>
      <div className="w-full mt-4 flex justify-center gap-3">
        <ButtonOutlined className={'w-[120px] py-2 px-5 text-xs'} label="Cancel" onClick={onClose} />
        <ButtonFilled disabled={disableBtn} label="Repay" onClick={submitRepay} />
      </div>
    </Modal>
  )
};
export default Repay;