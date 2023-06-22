import {useEffect, useState} from 'react';
import {ArrowDownIcon} from '@heroicons/react/20/solid';
import {DEFAULT_ASSETS} from '../../../utils/constants';
import Modal from "../../../components/Modal";
import Item from "../../../components/Item";
import SelectAssets from '../../../components/forms/selects/SelectAssets';
import ButtonFilled from "../../../components/buttons/ButtonFilled";
import ButtonOutlined from "../../../components/buttons/ButtonOutlined";
import ButtonText from "../../../components/buttons/ButtonText";
import DateSelect from '../../../components/forms/dateInput/DateSelect';
import TimeInput from '../../../components/forms/TimeInput';
import NoborderInput from "../../../components/forms/inputs/NoborderInput";
import Image from 'next/image';
import {Formator} from "../../../utils/formator";
import Maths from "../../../utils/maths";
import AaveOffline from "../../../service/aave_offline";
import uniqid from 'uniqid';
const aaveOffline = new AaveOffline();
const SwapSupply = (props) => {
    const {
        open,
        onClose,
        modalData,
        selectedDate,
        userSummary,
        assetsToSupply,
        userEmodeCategoryId,
        simulationData,
        rangeValue,
        setSimulationActions,
        simulationActions,
        typeBorrow,
        lastHour = '00:10', 
        setLastHour
    } = props;
    const [tempLastHour, setTempLastHour] = useState('');
    const [tokensList,
        setTokensList] = useState([]);
    const [asset2,
        setAsset2] = useState("");
    const [token2,
        setToken2] = useState(0);
    const [token2PriceInUSD,
        setToken2PriceInUSD] = useState(0);
    const [direction,
        setDirection] = useState(true);
    const [locked,
        setLocked] = useState('token1');
    const [valid,
        setValid] = useState(false);
    const [amount,
        setAmount] = useState(0);
    const pointData = simulationData[rangeValue];
    const [newAmount,
        setNewAmount] = useState(0);
    const [priceImpact,
        setPriceImpact] = useState("0");
    const [possibleHealthFactor,
        setPossibleHealthFactor] = useState('?');
    const [errorText,
        setErrorText] = useState('');
    const [disableBtn,
        setDisableBtn] = useState(true);
    const submitSwap = () => {
        let actionId = uniqid();
        if (lastHour != null && typeof lastHour !== 'undefined') {
            var actionSeconds = Formator.convertTimeToSeconds(tempLastHour);
          } else {
            var actionSeconds = null; // ou une valeur par défaut si nécessaire
          }
        const indexPoints = rangeValue;
        let newQtyA = newAmount;
        let symbolA = modalData
            ?.reserve
                ?.symbol;
        let newQtyB = token2;
        //addition :) QtyB + newQtyB
        let symbolB = asset2.symbol;
        const newAction = {
            id: actionId,
            action: {
                type: 'swap',
                token_a: symbolA,
                token_a_qty: newQtyA,
                token_b: symbolB,
                token_b_qty: newQtyB
            },
            actionName: `Swap ${symbolA} > ${asset2.symbol}`,
            actionDetails: `${Number(amount).truncateDecimals(4)} > ${Number(token2).truncateDecimals(4)}`,
            actionSeconds: actionSeconds
        };
        console.log(newAction, 'newAction');
        if (!simulationActions) {
            const baseSimulationActions = {
                indexPoints: {
                    [indexPoints]: {
                        actions: [newAction]
                    }
                }
            };
            setSimulationActions(baseSimulationActions);
        } else {
            if (simulationActions && simulationActions.indexPoints && simulationActions.indexPoints[indexPoints]
                ?.actions) {
                // Add newAction to the existing actions array using setSimulationActions
                setSimulationActions({
                    ...simulationActions,
                    indexPoints: {
                        ...simulationActions.indexPoints,
                        [indexPoints]: {
                            ...simulationActions.indexPoints[indexPoints],
                            actions: [
                                ...simulationActions.indexPoints[indexPoints].actions,
                                newAction
                            ]
                        }
                    }
                });
            } else {
                // Create simulationActions.indexPoints[indexPoints] and
                // simulationActions.indexPoints[indexPoints].actions, then push newAction using
                // setSimulationActions
                setSimulationActions({
                    ...simulationActions,
                    indexPoints: {
                        ...simulationActions.indexPoints,
                        [indexPoints]: {
                            actions: [newAction]
                        }
                    }
                });
            }
        }
        setLastHour(tempLastHour)
    };
    const calculatePossibleHealthFactor = (amount, newQtyA, symbolA, newQtyB, symbolB) => {
        setErrorText('')
        setPossibleHealthFactor('?');
        if (selectedDate != 0) { //todo : if HOUR is not selected
            if (amount > 0) {
                setDisableBtn(false);
                if (pointData && pointData.userProjection != undefined) {
                    if (amount > Number(modalData
                        ?.underlyingBalance)) {
                        setErrorText("Amount too high for your balance")
                        setDisableBtn(true);
                    } else {
                        //Change value to simulate & get the possible healthfactor !
                        const pointDataUserProjection = _.cloneDeep(pointData.userProjection);
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
                              // Action à effectuer si modalData.symbol ne correspond à aucun des cas précédents
                          }
                       
                        let liquidityIndex = matchingReserve.reserve.liquidityIndex / Math.pow(10, 27);
                        let qty = newQtyA;
                        let qtyScaled = qty * liquidityIndex;
                        let finalScaledATokenBalance = qtyScaled;
                        matchingReserve.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserve.reserve.decimals);
                        var matchingReserveToken2 = pointDataUserProjection
                            .reserve
                            .find(reserveData => reserveData.reserve.symbol === symbolB);
                        let baseScaledATokenBalanceToken2 = matchingReserveToken2.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                        let liquidityIndexToken2 = matchingReserveToken2.reserve.liquidityIndex / Math.pow(10, 27);
                        let qtyToken2 = newQtyB;
                        let qtyScaledToken2 = qtyToken2 * liquidityIndexToken2;
                        //addition :)
                        let finalScaledATokenBalanceToken2 = baseScaledATokenBalanceToken2 + qtyScaledToken2;
                        matchingReserveToken2.scaledATokenBalance = finalScaledATokenBalanceToken2 * Math.pow(10, matchingReserveToken2.reserve.decimals);
                        var hasPositiveScaledATokenBalance = false;
                        if (matchingReserveToken2.reserve.isIsolated === false) {
                            matchingReserveToken2.usageAsCollateralEnabledOnUser = true;
                        } else {
                            for (let i = 0; i < pointDataUserProjection.reserve.length; i++) {
                                const reserveData = pointDataUserProjection.reserve[i];
                                if (reserveData.reserve.symbol !== symbolB && reserveData.scaledATokenBalance > 0) {
                                    hasPositiveScaledATokenBalance = true;
                                    matchingReserveToken2.usageAsCollateralEnabledOnUser = false;
                                    break;
                                }
                            }
                        }
                        let healthFactor = aaveOffline
                            .getUserSummary(pointDataUserProjection, pointData.currentFormattedPoolReserves, pointData.baseCurrencyData, pointData.userProjection.summary.userEmodeCategoryId)
                            .healthFactor;
                        console.log(healthFactor, 'healthFactor')
                        let possible = Number(healthFactor).truncateDecimals(2);
                        if (possible < 1.01) {
                            if (hasPositiveScaledATokenBalance) {
                                setErrorText(`The asset ${symbolB} is only available in isolation mode. To use this asset, please disable all other collateral first.`);
                            } else {
                                setErrorText("Health Factor too low, < 1 = liquidation risk")
                            }
                            setDisableBtn(true);
                        }
                        setPossibleHealthFactor(possible);
                    }
                }
            }
        } 
    }
    const changeToken2 = () => {
        // Appliquer l'impact de prix
        let adjustedPriceInUSD;
        if (priceImpact < 0 || priceImpact.toString().includes('-')) {
            adjustedPriceInUSD = modalData
                ?.reserve.priceInUSD * (1 - priceImpact / 100);
        } else {
            adjustedPriceInUSD = modalData
                ?.reserve.priceInUSD / (1 + priceImpact / 100);
        }
        let token2 = (adjustedPriceInUSD / asset2.priceInUSD) * amount;
        setToken2(Number(token2).truncateDecimals(4));
        setToken2PriceInUSD(Number(token2 * asset2.priceInUSD).truncateDecimals(2));
    }
    const onChangeAmount = (e) => {
        setAmount(Number(e.target.value).truncateDecimals(4));
    };
    const onChangePriceImpact = (e) => {
        setPriceImpact(e.target.value);
    };
    const onSetMaxAmount = () => {
        setAmount(Number(modalData
            ?.underlyingBalance).truncateDecimals(4))
    }
    const onChangeAsset2 = (id) => {
        const selected = tokensList.find(item => item.id === id);
        setAsset2(selected);
        console.log(userSummary.userReservesData, 'userSummary.userReservesData')
    };
    useEffect(() => {
        if (userSummary && userSummary.userReservesData) {
            const newArray = Object
                .keys(userSummary.userReservesData)
                .map((key) => {
                    // ne pas ajouter l'élément si sa propriété `symbol` correspond à
                    // `modalData.reserve.symbol`
                    if (userSummary.userReservesData[key].reserve.symbol !== modalData
                        ?.reserve
                            ?.symbol) {
                        return {
                            id: key,
                            qty: Number(userSummary.userReservesData[key].underlyingBalance).truncateDecimals(4),
                            priceInUSD: userSummary.userReservesData[key].reserve.priceInUSD,
                            symbol: userSummary.userReservesData[key].reserve.symbol,
                            icon: userSummary.userReservesData[key].reserve.iconSymbol,
                        };
                    }
                    return null;
                })
                .filter(item => item !== null);
            setTokensList(newArray);
        }
    }, [userSummary, modalData]);
    useEffect(() => {
        changeToken2()
        let newAmount = Number(modalData
            ?.underlyingBalance - amount);
        setNewAmount(newAmount)
    }, [amount, asset2, priceImpact]);
    useEffect(() => {
        setDisableBtn(true);
        setAsset2("")
    }, [open]);
    useEffect(() => {
        setDisableBtn(true);
        let newQtyA = newAmount;
        let symbolA = modalData
            ?.reserve
                ?.symbol;
        let newQtyB = token2;
        let symbolB = asset2.symbol;
        if (newQtyA && symbolA && newQtyB && symbolB) {
            calculatePossibleHealthFactor(amount, newQtyA, symbolA, newQtyB, symbolB);
        }
    }, [token2]);
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
                Swap {modalData
                    ?.reserve
                        ?.symbol}
            </div>
            <div className="mt-4 flex justify-between gap-10">
                <DateSelect date={new Date(selectedDate)} className="w-1/2"/>
                <TimeInput className="w-1/2" value={tempLastHour} onChange={handleLastHourChange}/>
            </div>
            <div className="relative mt-4">
                <Item className="mt-4">
                    <div className="flex items-center justify-between">
                        <div className="w-2/3">
                            <div className="flex items-center gap-2">
                                {/* Ajout d'un conteneur flex pour aligner l'image et NoborderInput */}
                                <div className="text-gray-light text-sm">{modalData
                                        ?.reserve
                                            ?.symbol}</div>
                                <Image
                                    src={"/icons/tokens/" + modalData
                                    ?.reserve
                                        ?.symbol
                                            ?.toLowerCase() + ".svg"}
                                    width="20"
                                    height="20"
                                    alt="token"/>
                                <NoborderInput
                                    value={amount}
                                    placeholder={0}
                                    type="number"
                                    onChange={onChangeAmount}/>
                            </div>
                            <div className="flex justify-start items-center gap-4 mt-2.5">
                                <div className="text-gray-light text-sm">
                                    Amount {Formator.formatNumber(modalData
                                        ?.underlyingBalance)}
                                </div>
                                <ButtonText text="Max" onClick={() => onSetMaxAmount()}/>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <div className="text-gray-light text-sm text-end mt-2">
                                $ {Number(amount * modalData
                                    ?.reserve.priceInUSD).truncateDecimals(2)}
                            </div>
                        </div>
                    </div>
                </Item>
                <Item className="mt-4 flex items-stretch justify-between">
                    <div className="flex items-center">
                        <div className="text-gray-light text-sm w-48">Price impact %</div>
                        <NoborderInput
                            value={priceImpact}
                            type="number"
                            onChange={onChangePriceImpact}/>
                    </div>
                </Item>
                <div
                    className='w-fit h-fit left-0 right-0 mt-5 m-auto p-1 border-white border-2 border-opacity-20 rounded bg-blue-crayola hover:bg-blue-tiful'>
                    <ArrowDownIcon className="text-white w-3"/>
                </div>
                <Item className="mt-4 flex items-stretch justify-between">
                    <div className='flex flex-col justify-between'>
                        <NoborderInput type="number" value={token2} placeholder={0} readonly/>
                        <div className="text-gray-light text-xs">{isNaN(token2PriceInUSD)
                                ? 0
                                : token2PriceInUSD}
                            $</div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                        <SelectAssets
                            options={tokensList}
                            value={asset2}
                            onChange={onChangeAsset2}
                            displayQty={false}/>
                    </div>
                </Item>
            </div>
            <Item className="mt-4">
                <div className="">
                    <div className="flex justify-between gap-4 mt-4">
                        <div className="text-white text-sm">{modalData
                                ?.reserve
                                    ?.symbol}</div>
                        <div className="text-gray-light text-sm text-end">{Number(modalData
                                ?.underlyingBalance).truncateDecimals(4)}
                            &#62; {amount > 0
                                ? Number((newAmount)).truncateDecimals(4)
                                : Number(modalData
                                    ?.underlyingBalance).truncateDecimals(4)}</div>
                    </div>
                    <div className="flex justify-between gap-4 mt-4">
                        <div className="text-white text-sm">{asset2.symbol
                                ? asset2.symbol
                                : 'Select Asset'}</div>
                        <div className="text-gray-light text-sm text-end">{asset2.qty
                                ? asset2.qty
                                : 0}
                            &#62; {isNaN(token2)
                                ? 0
                                : Number(asset2.qty + token2)}</div>
                    </div>
                    <div className="flex justify-between gap-4 mt-4">
                        <div className="text-white text-sm">Health Factor</div>
                        <div className="text-gray-light text-sm text-end">{Number(userSummary
                                ?.healthFactor).truncateDecimals(2)}
                            &#62; {possibleHealthFactor}</div>
                    </div>
                </div>
            </Item>
            <div className='text-sm text-red-shimmer mt-2'>{errorText}</div>
            <div className="w-full mt-4 flex justify-center gap-3">
                <ButtonOutlined
                    className={'w-[120px] py-2 px-5 text-xs'}
                    label="Cancel"
                    onClick={onClose}/>
                <ButtonFilled label="Swap" disabled={disableBtn} onClick={submitSwap}/>
            </div>
        </Modal>
    )
};
export default SwapSupply;