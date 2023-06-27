import { useState, useCallback, useEffect, Fragment } from 'react';
import _ from 'lodash';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from "highcharts-react-official";
import { useRouter } from "next/router";
import axios from "axios";
import RangeSlider from '../../../components/forms/slider/RangeSlider';
import BtnSwitch from "../../../components/btnSwitch";
import ScrollToSelected from '../../../blocks/ScrollToselected';
import Card from '../../../components/Card';
import moment from "moment";
import AaveOffline from "../../../service/aave_offline";
import Aave from "../../../service/aave";
import { milliToDateMilli, formatMonthYearDate, getMax, getMin } from '../../../utils/functions';
import MainLayout from '../../../layouts/mainLayout';
import Link from 'next/link';
import { CheckIcon, ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import Heading from '../../../components/heading';
import Image from 'next/image';
import ButtonOutlined from '../../../components/buttons/ButtonOutlined';
import { Maths } from "../../../utils/maths";
import { Formator } from "../../../utils/formator";
import ModalLoading from '../../../components/modalLoading';
import Supply from '../../../blocks/modals/simulation/Supply';
import Withdraw from '../../../blocks/modals/simulation/Withdraw';
import SwapSupply from '../../../blocks/modals/simulation/SwapSupply';
import Repay from '../../../blocks/modals/simulation/Repay';
import Borrow from '../../../blocks/modals/simulation/Borrow';
import Add from '../../../blocks/modals/simulation/Add';
import Gas from '../../../blocks/modals/simulation/Gas';
import Reset from '../../../blocks/modals/simulation/Reset';
export default function ViewSimulation() {
  const router = useRouter();
  const { simulationId } = router.query;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [endValue, setEndValue] = useState(false);
  const [showChart, setShowChart] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(false);
  const [portfolioDebt, setPortfolioDebt] = useState(false);
  const [portfolioCollateral, setPortfolioCollateral] = useState(false);
  const [portfolioHealthFactor, setPortfolioHealthFactor] = useState(false);
  const [tokenPositions, setTokenPositions] = useState([]);
  const [tokenSelected, setTokenSelected] = useState(false);
  const [tokenSelectedDatas, setTokenSelectedDatas] = useState(false);
  const [tabName, setTabName] = useState("Summary");
  const [utilData, setUtilData] = useState();
  const [tabs, setTabs] = useState([
    { name: "Summary", current: true },
    { name: "Tokens", current: false },
  ]);
  const [market, setMarket] = useState();
  const [disable, setDisable] = useState(true);
  const [displayAll, setDisplayAll] = useState(false);
  const [displayAllAssetsToSupply, setDisplayAllAssetsToSupply] = useState(false);
  const [displayChart, setDisplayChart] = useState(false);
  const [, setChart] = useState(null);
  const [popup, setPopup] = useState();
  const [formatedData, setFormatedData] = useState([]);
  const [minX, setMinX] = useState();
  const [maxX, setMaxX] = useState();
  const [rangeValue, setRangeValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [simulationData, setSimulationData] = useState([]);
  const [simulationActions, setSimulationActions] = useState([]);
  const aaveOffline = new AaveOffline();
  const aave = new Aave();
  const [userSummary, setUserSummary] = useState(null);
  const [assetsToSupply, setAssetsToSupply] = useState(null);
  const [assetsToBorrow, setAssetsToBorrow] = useState(null);
  const [userEmodeCategoryId, setUserEmodeCategoryId] = useState(null);
  const [openSupply, setOpenSupply] = useState(false);
  const [openWithDraw, setOpenWithDraw] = useState(false);
  const [openSwapSupply, setOpenSwapSupply] = useState(false);
  const [openRepay, setOpenRepay] = useState(false);
  const [openBorrow, setOpenBorrow] = useState(false);
  const [openGas, setOpenGas] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [lastKey, setLastKey] = useState(0);
  const [typeBorrow, setTypeBorrow] = useState('variable');
  const [lastHour, setLastHour] = useState('00:00');
  const [beforeLastHour, setBeforeLastHour] = useState('00:00');
  const [actionsCount, setActionsCount] = useState(0);
  const [averageGasPerAction, setAverageGasPerAction] = useState('0.01');
  const [firstLoadDb, setFirstLoadDb] = useState(false);
  const [indexRangePostAction, setIndexRangePostAction] = useState('0');

  useEffect(() => {
    const cookies = document.cookie.split(';');
    if (cookies.find(item => item.includes('user_cookie'))) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [])

  const resetActions = () => {
    axios.post("/api/simulation/update", { simulationId, actions: '', averageGasPerAction: '' })
      .then(function (response) {
        window.location.reload();
      })
  }

  const cleanModal = () => {
    setOpenModal(false);
    setOpenSupply(false);
    setOpenWithDraw(false);
    setOpenSwapSupply(false);
    setOpenRepay(false);
    setOpenBorrow(false);
    setOpenAdd(false);
    setOpenGas(false);
    setOpenReset(false);
    setFirstLoadDb(false);
  }
  const onOpenResetModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenReset(true);
    setOpenModal(true);
  }
  const onCloseResetModal = () => {
    setOpenReset(false);
    cleanModal();
  }
  const onOpenGasModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenGas(true);
    setOpenModal(true);
  }
  const onCloseGasModal = () => {
    setOpenGas(false);
    cleanModal();
  }
  const onOpenSupplyModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenSupply(true);
    setOpenModal(true);
  }
  const onCloseSupplyModal = () => {
    setOpenSupply(false);
    cleanModal();
  }
  const onOpenAddModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenAdd(true);
    setOpenModal(true);
  }
  const onCloseAddModal = () => {
    setOpenAdd(false);
    cleanModal();
  }
  const onOpenWithDrawModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenWithDraw(true);
    setOpenModal(true);
  }
  const onCloseWithDrawModal = () => {
    setOpenWithDraw(false);
    cleanModal();
  }
  const onOpenSwapSupplyModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenSwapSupply(true);
    setOpenModal(true);
  }
  const onCloseSwapSupplyModal = () => {
    setOpenSwapSupply(false);
    cleanModal();
  }
  const onOpenRepayModal = (asset, type) => {
    cleanModal();
    setModalData(asset);
    setOpenRepay(true);
    setOpenModal(true);
    setTypeBorrow(type)
  }
  const onCloseRepayModal = () => {
    setOpenRepay(false);
    cleanModal();
  }
  const onOpenBorrowModal = (asset) => {
    cleanModal();
    setModalData(asset);
    setOpenBorrow(true);
    setOpenModal(true);
  }
  const onCloseBorrowModal = () => {
    setOpenBorrow(false);
    cleanModal();
  };
  const toggleChart = () => {
    setShowChart(state => !state);
  }
  switch (market) {
    case "mainnet_v3":
      var marketName = 'Ethereum';
      var gasToken = 'ETH';
      var eModes = ['Disabled', 'ETH correlated']
      break;
    case "polygon_v3":
      var marketName = 'Polygon';
      var gasToken = 'MATIC';
      var eModes = ['Disabled', 'Stablecoins', 'MATIC correlated']
      break;
    case "fantom_v3":
      var marketName = 'Fantom';
      var gasToken = 'ETH';
      var eModes = ['Disabled', 'Stablecoins']
      break;
    case "arbitrum_v3":
      var marketName = 'Arbitrum';
      var gasToken = 'ETH';
      var eModes = ['Disabled', 'Stablecoins', 'ETH correlated']
      break;
    case "optimism_v3":
      var marketName = 'Optimism';
      var gasToken = 'ETH';
      var eModes = ['Disabled', 'Stablecoins']
      break;
    case "avalanche_v3":
      var marketName = 'Avalanche';
      var gasToken = 'AVAX';
      var eModes = ['Disabled', 'Stablecoins', 'AVAX correlated']
      break;
    case "harmony_v3":
      var marketName = 'Harmony';
      var gasToken = 'ONE';
      var eModes = ['Disabled', 'Stablecoins']
      break;
    default:
      var marketName = 'Ethereum';
      var gasToken = 'ETH';
      var eModes = ['Disabled', 'ETH correlated']
      break;
  }
  const callback = useCallback((HighchartsChart) => {
    setChart(HighchartsChart);
  }, []);
  function switchTab(event) {
    event.preventDefault();
    setTabs(
      tabs.map((tab) => {
        if (tab.name == tabName) return { ...tab, current: false };
        if (tab.name == event.target.name) return { ...tab, current: true };
        return tab;
      })
    );
    setTabName(event.target.name);
  }
  function getTokenPositions(token) {
    let tokenPosition = tokenPositions.find((tokenPosition) => tokenPosition.id == token.id);
    if (tokenPosition) {
      setTokenSelectedDatas(tokenPosition);
    }
  }
  const formatingData = (jsonData) => {
    return jsonData.map(item => {
      return [item.date, item.value]
    })
  }
  useEffect(() => {
    const findLastActionHour = (data) => {
      if (data?.indexPoints != null) {
        const actionHours = [];
        for (const indexPoint of Object.values(data.indexPoints)) {
          for (const actionObj of indexPoint.actions) {
            actionHours.push(actionObj.actionHour);
          }
        }
        actionHours.sort((a, b) => {
          const [aHour, aMinute] = a.split(':').map(Number);
          const [bHour, bMinute] = b.split(':').map(Number);
          return bHour - aHour || bMinute - aMinute;
        });
        return actionHours[0];
      }
      else {
        return '00:00';
      }
    }
    const getSimulation = async () => {
      setLoading(true);
      if (simulationId) {
        const result = await axios.post("/api/simulation/read", { simulationId });
        if (result.status == 200) {
          if (result.data.length > 0) {
            setData(result.data[0]);
            if (simulationActions?.length === 0) {
              setFirstLoadDb(true);
              setSimulationActions(result.data[0].actions);
              setLastHour(findLastActionHour(result.data[0].actions))
            }
            generateReport(result.data[0]);
            setTokenPositions(result.data[0].tokenPositions);
            setMarket(result.data[0].projectionPositions.market);
            setDisplayAll(false);
          }
          else {
            router.push(`/`)
            return false;
          }
        }
      }
      else {

      }
    };
    getSimulation();
    let totalActions = 0;
    let indexPoints = simulationActions?.indexPoints;
    for (let key in indexPoints) {
      if (indexPoints.hasOwnProperty(key)) {
        totalActions += indexPoints[key].actions.length;
      }
    }
    setActionsCount(totalActions);
  }, [simulationId, simulationActions]);
  const transformArray = (inputArray, startDate, inputActions) => {
    const result = [];
    let actionId = 1;
    for (let i = 0; i < inputArray.length; i++) {
      const date = moment(startDate).add(i, 'days').valueOf();
      const value = inputArray[i];
      const actions = (inputActions && inputActions.indexPoints && inputActions.indexPoints[i]) ? inputActions.indexPoints[i].actions : [];
      actions.forEach(item => {
        const seconds = item?.actionSeconds ?? 0;
        const actionHour = Formator.convertSecondsToTime(seconds);
        item.actionHour = actionHour;
      });
      result.push({ date, value, actions });
    }
    setUtilData(result);
  };
  const generateReport = async (data) => {
    if (data) {
      var projectionPositions = data.projectionPositions;
      var tokenPositions = data.tokenPositions;
      var dates = tokenPositions[0].dates;
      var userReserveData = projectionPositions.userSummary.userReservesData;
      var actions = simulationActions;

      var userProjections = [];
      var userProjectionsActions = [];
      const walletBalancesCopy = [];
      for (var i = 0; i < dates.length; i++) {
        walletBalancesCopy[i] = i === 0
          ? _.cloneDeep(projectionPositions.walletBalances)
          : _.cloneDeep(walletBalancesCopy[i - 1]);
        function updateReserveData(previousUserReserve, userProjections, tokenPositions, projectionPositions, i) {
          var currentUserReserve = _.cloneDeep(previousUserReserve);
          var currentFormattedPoolReserves = _.cloneDeep(projectionPositions.formattedPoolReserves);
          currentUserReserve.map((reserveData, index) => {
            if (walletBalancesCopy[i - 1] && walletBalancesCopy[i - 1][reserveData.underlyingAsset] && walletBalancesCopy[i - 1][reserveData.underlyingAsset].amount !== undefined) {
              if (i > 0) {
                let amountPrec = parseFloat(walletBalancesCopy[i - 1][reserveData.underlyingAsset].amount);
                let amountUSDPrec = parseFloat(walletBalancesCopy[i - 1][reserveData.underlyingAsset].amountUSD);
                walletBalancesCopy[i][reserveData.underlyingAsset].amount = amountPrec;
                walletBalancesCopy[i][reserveData.underlyingAsset].amountUSD = amountUSDPrec;
              }
            }
            reserveData.scaledATokenBalance = ((parseFloat(previousUserReserve[index].scaledATokenBalance) * parseFloat(reserveData.reserve.supplyAPY)) / 365 + parseFloat(previousUserReserve[index].scaledATokenBalance)).toString();
            reserveData.scaledVariableDebt = ((parseFloat(previousUserReserve[index].scaledVariableDebt) * parseFloat(reserveData.reserve.variableBorrowAPY)) / 365 + parseFloat(previousUserReserve[index].scaledVariableDebt)).toString();
            reserveData.principalStableDebt = ((parseFloat(previousUserReserve[index].principalStableDebt) * parseFloat(reserveData.reserve.stableBorrowAPY)) / 365 + parseFloat(previousUserReserve[index].principalStableDebt)).toString();
            let position = tokenPositions.find((position) => {
              return position.id == reserveData.id;
            });
            if (position) {
              const positionValues = position.values[i];
              reserveData.reserve.formattedPriceInMarketReferenceCurrency = positionValues != null ? positionValues.toString() : null;
              reserveData.reserve.priceInUSD = positionValues != null ? positionValues.toString() : null;
              reserveData.reserve.priceInMarketReferenceCurrency = position.values[i] * Math.pow(10, 8);
            }
            reserveData.dateReserve = moment().add(i, "day");
          });
          currentFormattedPoolReserves.forEach((reserveF, index) => {
            let position = tokenPositions.find((position) => {
              let idParts = position.id.split('-');
              let newId = "undefined-" + idParts[idParts.length - 2] + '-' + idParts[idParts.length - 1];
              return newId == reserveF.id;
            });
            if (position) {
              const positionValues = position.values[i];
              reserveF.formattedPriceInMarketReferenceCurrency = positionValues != null ? positionValues.toString() : null;
              reserveF.priceInUSD = positionValues != null ? positionValues.toString() : null;
              reserveF.priceInMarketReferenceCurrency = position.values[i] * Math.pow(10, 8);
            }
          });
          if (actions && actions.indexPoints && actions.indexPoints[i]) {
            actions.indexPoints[i].actions.forEach(function (actionItem) {
              const matchingReserve = currentUserReserve.find(reserveData => reserveData.reserve.symbol === actionItem.action.token_a);

              const matchingReserveWrapped = currentUserReserve.find(reserveData => reserveData.reserve.symbol === 'WETH');
              if (matchingReserve?.reserve?.symbol == actionItem.action.token_a) {
                switch (actionItem.action.type) {
                  case 'add':
                    let amountAdd = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amount);
                    let amountUSDAdd = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD);
                    let valueOfOneAmountInUSDAdd = amountUSDAdd / amountAdd;
                    let newAmountAdd = Number(amountAdd) + Number(actionItem.action.token_a_qty);
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amount = newAmountAdd;
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD = newAmountAdd * valueOfOneAmountInUSDAdd;
                    break;
                  case 'supply':
                    let baseScaledATokenBalance = matchingReserve.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                    let liquidityIndex = matchingReserve.reserve.liquidityIndex / Math.pow(10, 27);
                    let qty = actionItem.action.token_a_qty;

                    let qtyScaled = qty * liquidityIndex;
                    let finalScaledATokenBalance = baseScaledATokenBalance + qtyScaled;
                    matchingReserve.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserve.reserve.decimals);
                    matchingReserve.usageAsCollateralEnabledOnUser = actionItem.action.usageAsCollateralEnabledOnUser;
                    matchingReserve.testId = actionItem.id;
                    if (actionItem.action.wrapped) {
                      let amount = parseFloat(walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amount);
                      let amountUSD = parseFloat(walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amountUSD);
                      let valueOfOneAmountInUSD = amountUSD / amount;
                      let newAmount = Number(amount) - Number(actionItem.action.token_a_qty);
                      walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amount = newAmount;
                      walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amountUSD = newAmount * valueOfOneAmountInUSD;
                    }
                    else {
                      let amount = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amount);
                      let amountUSD = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD);
                      let valueOfOneAmountInUSD = amountUSD / amount;
                      let newAmount = Number(amount) - Number(actionItem.action.token_a_qty);
                      walletBalancesCopy[i][matchingReserve.underlyingAsset].amount = newAmount;
                      walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD = newAmount * valueOfOneAmountInUSD;
                    }
                    break;
                  case 'repay':
                    let variableIndex = matchingReserve.reserve.variableBorrowIndex / Math.pow(10, 27);
                    let qtyVariable = actionItem.action.token_a_qty * variableIndex;
                    let qtyFinal = qtyVariable * Math.pow(10, matchingReserve.reserve.decimals);
                    if (typeBorrow == 'stable') {
                      matchingReserve.principalStableDebt = actionItem.action.token_a_qty * Math.pow(10, matchingReserve.decimals);
                    }
                    else {
                      let BaseScaledVariableDebt = matchingReserve.scaledVariableDebt / Math.pow(10, matchingReserve.reserve.decimals);
                      matchingReserve.scaledVariableDebt = qtyFinal;
                    }
                    if (actionItem.action.token_b_from == 'collateral') {

                      var matchingReserveRepayWith = currentUserReserve.find(reserveData => reserveData.reserve.symbol === actionItem.action.token_b);
                      let baseScaledATokenBalance = matchingReserveRepayWith.scaledATokenBalance / Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                      let liquidityIndex = matchingReserveRepayWith.reserve.liquidityIndex / Math.pow(10, 27);
                      let qty = actionItem.action.token_b_qty;
                      let qtyScaled = qty * liquidityIndex;
                      let finalScaledATokenBalance = baseScaledATokenBalance - qtyScaled;
                      matchingReserveRepayWith.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                    }
                    else {

                      let amountAdd = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amount);
                      let amountUSDAdd = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD);
                      let valueOfOneAmountInUSDAdd = amountUSDAdd / amountAdd;
                      let newAmountAdd = Number(amountAdd) - Number(actionItem.action.token_b_qty);
                      const matchingReserveRepayB = currentUserReserve.find(reserveData => reserveData.reserve.symbol === actionItem.action.token_b);
                      walletBalancesCopy[i][matchingReserveRepayB.underlyingAsset].amount = newAmountAdd;
                      walletBalancesCopy[i][matchingReserveRepayB.underlyingAsset].amountUSD = newAmountAdd * valueOfOneAmountInUSDAdd;
                    }
                    break;
                  case 'swap':
                    let liquidityIndexSwapA = matchingReserve.reserve.liquidityIndex / Math.pow(10, 27);
                    let qtySwapA = actionItem.action.token_a_qty;
                    let qtyScaledSwapA = qtySwapA * liquidityIndexSwapA;
                    let finalScaledATokenBalanceSwapA = qtyScaledSwapA;
                    matchingReserve.scaledATokenBalance = finalScaledATokenBalanceSwapA * Math.pow(10, matchingReserve.reserve.decimals);
                    var matchingReserveSwapB = currentUserReserve.find(reserveData => reserveData.reserve.symbol === actionItem.action.token_b);
                    let baseScaledATokenBalanceSwapB = matchingReserveSwapB.scaledATokenBalance / Math.pow(10, matchingReserveSwapB.reserve.decimals);
                    let liquidityIndexSwapB = matchingReserveSwapB.reserve.liquidityIndex / Math.pow(10, 27);
                    let qtySwapB = actionItem.action.token_b_qty
                    let qtyScaledSwapB = actionItem.action.token_b_qty * liquidityIndexSwapB;
                    let finalScaledATokenBalanceSwapB = baseScaledATokenBalanceSwapB + qtyScaledSwapB;
                    matchingReserveSwapB.scaledATokenBalance = finalScaledATokenBalanceSwapB * Math.pow(10, matchingReserveSwapB.reserve.decimals);
                    matchingReserveSwapB.usageAsCollateralEnabledOnUser = true;
                    break;
                  case 'withdraw':
                    let baseScaledATokenBalanceWithdraw = matchingReserve.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                    let liquidityIndexWithdraw = matchingReserve.reserve.liquidityIndex / Math.pow(10, 27);
                    let qtyWithdraw = actionItem.action.token_a_qty;
                    let qtyScaledWithdraw = qtyWithdraw * liquidityIndexWithdraw;
                    let finalScaledATokenBalanceWithdraw = baseScaledATokenBalanceWithdraw - qtyScaledWithdraw;
                    matchingReserve.scaledATokenBalance = finalScaledATokenBalanceWithdraw * Math.pow(10, matchingReserve.reserve.decimals);
                    let amountWithdraw = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amount);
                    let amountUSDWithdraw = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD);
                    let valueOfOneAmountInUSDWithdraw = amountUSDWithdraw / amountWithdraw;
                    let newAmountWithdraw = Number(amountWithdraw) + Number(actionItem.action.token_a_qty);
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amount = newAmountWithdraw;
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD = newAmountWithdraw * valueOfOneAmountInUSDWithdraw;
                    break;
                  case 'borrow':

                    let amountBorrow = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amount);
                    let amountUSDBorrow = parseFloat(walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD);
                    let valueOfOneAmountInUSDBorrow = amountUSDBorrow / amountBorrow;
                    let newAmountBorrow = Number(amountBorrow) + Number(actionItem.action.token_a_qty);
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amount = newAmountBorrow;
                    walletBalancesCopy[i][matchingReserve.underlyingAsset].amountUSD = newAmountBorrow * valueOfOneAmountInUSDBorrow;

                    if (actionItem.action.type_borrow == 'variable') {

                      let baseScaledVariableDebt = matchingReserve.scaledVariableDebt / Math.pow(10, matchingReserve.reserve.decimals);
                      let variableBorrowIndex = matchingReserve.reserve.variableBorrowIndex / Math.pow(10, 27);
                      let qty = actionItem.action.token_a_qty;
                      let qtyScaled = qty * variableBorrowIndex
                      let finalScaledVariableDebt = baseScaledVariableDebt + qtyScaled;
                      matchingReserve.scaledVariableDebt = finalScaledVariableDebt * Math.pow(10, matchingReserve.reserve.decimals);


                    }
                    else {

                      let basePrincipalStableDebt = matchingReserve.principalStableDebt
                        / Math.pow(10, matchingReserve.reserve.decimals);
                      let qty = actionItem.action.token_a_qty;
                      let finalPrincipalStableDebt = basePrincipalStableDebt + qty;

                      matchingReserve.principalStableDebt = finalPrincipalStableDebt * Math.pow(10, matchingReserve.reserve.decimals);
                    }
                    break;
                }
              }
              else if (actionItem.action.type == 'add' && actionItem.action.wrapped) {
                let amountAdd = parseFloat(walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amount);
                let amountUSDAdd = parseFloat(walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amountUSD);
                let valueOfOneAmountInUSDAdd = amountUSDAdd / amountAdd;
                let newAmountAdd = Number(amountAdd) + Number(actionItem.action.token_a_qty);
                walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amount = newAmountAdd;
                walletBalancesCopy[i]['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'].amountUSD = newAmountAdd * valueOfOneAmountInUSDAdd;
              }
              const currentUserReserveCopy = _.cloneDeep(currentUserReserve);
              currentUserReserveCopy.forEach(reserveData => {
                reserveData.scaledATokenBalance = reserveData.scaledATokenBalance.toString();
                reserveData.reserve.liquidityIndex = reserveData.reserve.liquidityIndex.toString();
              });
              userProjectionsActions[actionItem.id] = { reserve: currentUserReserveCopy, dateReserve: moment().add(i, "day"), formattedPoolReserves: currentFormattedPoolReserves, walletBalances: walletBalancesCopy[i] };
            });
          }
          userProjections.push({ reserve: currentUserReserve, dateReserve: moment().add(i, "day"), formattedPoolReserves: currentFormattedPoolReserves, walletBalances: walletBalancesCopy[i] });
          return { userProjections, formattedPoolReserves: currentFormattedPoolReserves };
        }
        if (i != 0) {
          var previousUserReserve = userProjections[i - 1].reserve;
          var { userProjections, formattedPoolReserves } = updateReserveData(previousUserReserve, userProjections, tokenPositions, projectionPositions, i);
          var latestFormattedPoolReserves = formattedPoolReserves;
        } else {
          var { userProjections, formattedPoolReserves } = updateReserveData(userReserveData, userProjections, tokenPositions, projectionPositions, i);
          var latestFormattedPoolReserves = projectionPositions.formattedPoolReserves;
        }
      }
      if (projectionPositions.formattedPoolReserves && projectionPositions.baseCurrencyData) {
        var userProjectionsEND = aaveOffline.getUserSummaryPositions(userProjections, projectionPositions.formattedPoolReserves, projectionPositions.baseCurrencyData, projectionPositions.userSummary.userEmodeCategoryId);
      } else {

        var userProjectionsEND = aave.getUserSummaryPositions(userProjections, projectionPositions.formattedPoolReserves, projectionPositions.baseCurrencyData);
      }
      const labelsChart = dates;
      setEndValue(userProjectionsEND[dates.length - 1].summary.netWorthUSD);
      const simulationDataArr = [];
      for (let i = 0; i < userProjections.length; i++) {
        let element = userProjections[i];
        let summaryValue = element.summary;
        let currentFormattedPoolReserves = element.formattedPoolReserves;
        let baseCurrencyData = projectionPositions.baseCurrencyData;
        let userEmodeCategoryId = projectionPositions.userSummary.userEmodeCategoryId;
        let marketReferenceCurrencyPriceInUsd = baseCurrencyData.marketReferenceCurrencyPriceInUsd;
        let marketValue = marketReferenceCurrencyPriceInUsd;
        let walletBalances = element.walletBalances;
        let assetsToSupplyData = aaveOffline.getAssetsToSupply(currentFormattedPoolReserves, summaryValue, market, marketReferenceCurrencyPriceInUsd, walletBalances);
        let assetsToBorrowData = aaveOffline.getAssetsToBorrow(currentFormattedPoolReserves, summaryValue, market, marketReferenceCurrencyPriceInUsd);

        simulationDataArr.push({ assetsToBorrowData, assetsToSupplyData, userProjection: element, currentFormattedPoolReserves, baseCurrencyData, userEmodeCategoryId });
      }
      setSimulationData(simulationDataArr);
      transformArray(userProjections.map((reserveData) => parseFloat(reserveData.summary.netWorthUSD)), data?.tokenPositions && data?.tokenPositions[0]?.startDate, simulationActions);
      setPortfolioValue({
        labels: labelsChart,
        datasets: [{
          label: "Net Worth",
          data: userProjections.map((reserveData) => parseFloat(reserveData.summary.netWorthUSD)),
          borderColor: "rgb(209,83,89)",
          backgroundColor: "rgba(209,83,89, 0.5)",
        },],
      });
      setPortfolioDebt({
        labels: labelsChart,
        datasets: [{
          label: "Total Borrow",
          data: userProjections.map((reserveData) => parseFloat(reserveData.summary.totalBorrowsUSD)),
          borderColor: "rgb(83, 208, 72)",
          backgroundColor: "rgba(83, 208, 72, 0.5)",
        },],
      });
      setPortfolioCollateral({
        labels: labelsChart,
        datasets: [{
          label: "Total Supply",
          data: userProjections.map((reserveData) => parseFloat(reserveData.summary.totalCollateralUSD)),
          borderColor: "rgb(63, 102, 299)",
          backgroundColor: "rgba(63, 102, 299, 0.5)",
        },],
      });
      setPortfolioHealthFactor({
        labels: labelsChart,
        datasets: [{
          label: "Health Factor",
          data: userProjections.map((reserveData) => parseFloat(reserveData.summary.healthFactor)),
          borderColor: "rgb(245, 172, 55)",
          backgroundColor: "rgba(245, 172, 55, 0.5)",
        },],
      });

      if (actions && actions.indexPoints) {
        setLastKey(Object.keys(actions?.indexPoints).length > 0 ? Object.keys(actions?.indexPoints).pop() : 0)
        if (!firstLoadDb) {
          setIndexRangePostAction(Object.keys(actions?.indexPoints).length > 0 ? Object.keys(actions?.indexPoints).pop() : 0);

        }
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      cleanModal();
    }
  }, [loading])
  useEffect(() => {
    if (utilData !== null && utilData !== undefined) {
      setFormatedData(formatingData(utilData));
      const minValue = getMin(utilData, 'date');
      const maxValue = getMax(utilData, 'date');
      const min = milliToDateMilli(minValue)
      const max = milliToDateMilli(maxValue)
      setMinX(0);
      setMaxX(utilData.length - 1);

      setDisplayChart(true);
      if (lastKey === 0) {
        setPopup(formatMonthYearDate(+min));
      }
      setAssetsToSupply(simulationData[indexRangePostAction].assetsToSupplyData);
      setAssetsToBorrow(simulationData[indexRangePostAction].assetsToBorrowData);
      setUserSummary(simulationData[indexRangePostAction].userProjection.summary);
      setUserEmodeCategoryId(simulationData[indexRangePostAction].userEmodeCategoryId)
      setSelectedDate(utilData[indexRangePostAction].date);
      setRangeValue(indexRangePostAction);
    }
  }, [utilData]);
  const options = {
    credits: {
      enabled: false
    },
    chart: {
      backgroundColor: 'rgba(1, 0, 0, 0)',
      marginLeft: 50,
      marginRight: 50,
      reflow: true,
      height: showChart ? 500 : 70,
      events: {
        load: function () {
          this.series[0].group.attr({
            opacity: 0
          });
        }
      }
    },
    tooltip: {
      split: false,
      useHTML: true,
      borderRadius: 8,
      boxShadow: 'none',
      borderWidth: 0,
      backgroundColor: 'rgba(34, 36, 47, 0.9)',
      color: 'grey',
      height: 'fit-content',
      width: 'fit-content',
      formatter: function () {
        const selectedData = utilData?.find(item => item.date === this.x);
        const actions = selectedData?.actions;
        const value = this.y >= 1000000 ? `$${(this.y / 1000000).toFixed(2)}M` : `$${this.y.toFixed(2)}`;
        return `
        <div class="tooltip-container">
          <div class="date-title">
            <div>${Highcharts.dateFormat('%b %d, %Y', this.x)}</div>
            <div>value: ${value}</div>
          </div>
          ${actions && actions.length ? actions.map((item, index) => (
          `<div div class="detail-container" key=${index}>
            <div class="detail-info">${item?.actionName}</div>
            <div class="values-container">
              <div class="percent-value">${item?.actionDetails}</div>
              <div class="detail-time">${item?.actionHour}</div>
            </div>
          </div>`
        )) : (
            `<div class="detail-container">0 Action</div>`
          )}
        </div>`;
      }
    },
    xAxis: {
      tickWidth: 0,
      startOnTick: true,
      showFirstLabel: true,
      crosshair: false,
      lineColor: 'rgba(255, 255, 255, 0.05)',
      lineWidth: 0,
      labels: {
        enabled: showChart,
        formatter: function () {
          return Highcharts.dateFormat('%b %d, %Y', this.value);
        }
      }
    },
    yAxis: {
      opposite: false,
      gridLineColor: 'rgba(255, 255, 255, 0.05)',
      lineWidth: 0,
      labels: {
        enabled: showChart,
        align: 'left',
        x: -50,
        formatter: function () {
          if (this.value === 0) {
            return '$0';
          } else if (this.value >= 1000000) {
            return '$' + (this.value / 1000000).toFixed(2) + 'M';
          } else if (this.value >= 1000) {
            return '$' + (this.value / 1000).toFixed(2) + 'K';
          } else {
            return '$' + this.value.toFixed(2);
          }
        }
      }
    },
    plotOptions: {
      series: {
        marker: {
          enabled: showChart,
          symbol: "circle",
          radius: showChart ? 3 : 0,
          fillColor: "#4F7FFA",
          lineColor: "#4F7FFA",
          lineWidth: showChart ? 1 : 0,
        },
        dataLabels: {
          enabled: showChart,
          useHTML: true,
          formatter: function () {
            const selectedData = utilData.find(item => item.date === this.x);
            const actionsLength = selectedData?.actions?.length;
            if (actionsLength > 0) {
              return `
              <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid #4F7FFA;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                font-size: 10px;
                font-weight: bold;
                text-anchor: middle;
              ">
                ${actionsLength}
              </div>`;
            } else {
              return null;
            }
          },
          states: {
            enabled: showChart,
            hover: {
              fontSize: '8px'
            }
          },
          className: 'my-label',
          x: 4,
          y: 34,
        }
      },
    },
    rangeSelector: {
      enabled: false,
      inputPosition: {
        align: 'center',
      },
      inputStyle: {
        color: '#ffffff',
        fontFamily: 'Roboto',
        fontSize: 10,
        outline: 'none',
        border: 'none',
        borderRadius: 5
      },
      buttons: [{
        type: 'day',
        count: 1,
        text: '1D',
      }, {
        type: 'day',
        count: 7,
        text: '1W'
      }, {
        type: 'month',
        count: 1,
        text: '1M'
      }, {
        type: 'month',
        count: 6,
        text: '6M'
      },
      {
        type: 'year',
        count: 1,
        text: '1Y'
      }],
      selected: 4,
      buttonPosition: {
        align: 'right',
      },
      buttonSpacing: 5,
      buttonTheme: {
        width: 32,
        height: 28,
        style: {
          fontSize: 12,
          borderRadius: 4,
          borderWidth: 2,
          color: "#8D8E93",
          backgroundColor: 'red'
        }
      }
    },
    navigator: {
      scrollbar: {
        enabled: false,
        trackBorderColor: null,
        trackBorderWidth: null,
        trackBorderWidth: 0,
        trackWidth: 0
      },
      yAxis: {
        gridLineColor: 'rgba(255, 255, 255, 0.05)'
      },
      xAxis: {
        type: 'datetime',
        startOnTick: true,
        showFirstLabel: true,
        gridLineColor: 'rgba(255, 255, 255, 0.05)',
        labels: {
          formatter: function () {
            return Highcharts.dateFormat('%b, %Y', this.value);
          }
        }
      },
      outlineColor: 'rgba(255, 255, 255, 0.05)',
      outlineRadius: 4,
      outlineWidth: 1,
      maskFill: 'rgba(255, 255, 255, 0.1)',
      series: {
        type: 'line',
        lineColor: '#4F7FFA'
      },
    },
    series: [
      {
        lineColor: '#4F7FFA',
        lineWidth: showChart ? 3 : 0,
        data: formatedData,
        marker: {
          enabled: showChart,
          symbol: 'circle',
        },
      }
    ]
  };
  const onChangeSlider = (e) => {
    let indexRange;
    if (typeof e === 'string') {
      indexRange = e;
    } else {
      indexRange = +e.target.value;
    }
    setRangeValue(indexRange);
    setAssetsToSupply(simulationData[indexRange].assetsToSupplyData);
    setAssetsToBorrow(simulationData[indexRange].assetsToBorrowData);
    setUserSummary(simulationData[indexRange].userProjection.summary);
    setUserEmodeCategoryId(simulationData[indexRange].userEmodeCategoryId);
    setPopup(formatMonthYearDate(+utilData[indexRange].date));
    setSelectedDate(utilData[indexRange].date);
    if (lastKey == indexRange) {
      if (beforeLastHour != '00:00') {
        setLastHour(beforeLastHour)
      }
    }
    else if (lastKey <= indexRange) {
      if (lastHour != '00:00') {
        setBeforeLastHour(lastHour);
      }
      setLastHour('00:00')
    }
    else {
      setLastHour(beforeLastHour)
    }
  };

  useEffect(() => {
    if (simulationActions?.indexPoints) {
      const result = axios.post("/api/simulation/update", { simulationId, actions: simulationActions, averageGasPerAction });
    }
  }, [simulationActions]);
  return (
    <MainLayout>
      {!loading &&
        <>
          <div className="step_1">
            <div className="flex justify-between mb-4">
              <div className="flex mb-4">
                <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{data?.name}</h1>
                <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{marketName} Aave V3</h1>
                <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{data?.displayAddress}</h1>
              </div>
              <Link href={`/simulation/summary/${simulationId}`} legacyBehavior>
                <button className="ml-4 px-4 cursor-pointer text-center text-sm font-medium font-inter py-2 rounded-md bg-blue-crayola text-white hover:bg-blue-tiful focus:outline-none focus:ring focus:ring-blue-tiful-300">
                  See summary
                </button>
              </Link>

            </div>
            <Card className="p-4 flex items-center justify-between mb-5">
              <div className="flex items-center">

                <Heading title={marketName} sub="Aave v3" className="mx-4" />
                {/* <Heading title={moment(data?.projection?.startDate).format("MM.DD.YYYY")} sub="Start date" className="mx-4" /> */}
                <Heading title={data?.tokenPositions && moment(data?.tokenPositions[0]?.startDate).format("MM.DD.YYYY")} sub="Start date" className="mx-4" />
                {/* <Heading title={moment(data?.projection?.endDate).format("MM.DD.YYYY")} sub="End date" className="mx-4" /> */}
                <Heading title={data?.tokenPositions && moment(data?.tokenPositions[0]?.endDate).format("MM.DD.YYYY")} sub="End date" className="mx-4" />
                {/* <Heading title={moment(data?.projection?.endDate).diff(moment(data?.projection?.startDate), "days") + " d"} sub="Duration" className="mx-4" /> */}
                <Heading title={data?.tokenPositions && moment(data?.tokenPositions[0]?.endDate).diff(moment(data?.tokenPositions[0]?.startDate), "days") + " d"} sub="Duration" className="mx-4" />

              </div>

            </Card>
          </div>
          <Card className="py-6 px-3 mb-6">
            <div className="relative">
              <div className='h-[20px] px-10 flex items-center justify-end' onClick={toggleChart}>
                <div className='border border-gray-dark p-2 rounded-md cursor-pointer'>
                  <ChevronUpIcon className={`h-5 w-5 text-blue-crayola transform ${showChart ? "rotate-0" : "rotate-180"}`} />
                </div>
              </div>
              <div className='mt-6'>
                {displayChart ? (<HighchartsReact
                  highcharts={Highcharts}
                  constructorType={"stockChart"}
                  options={options}
                  callback={callback}
                />) : null}
              </div>
              <RangeSlider value={rangeValue} popup={popup} min={minX} max={maxX} onChange={onChangeSlider} />
              <div className='absolute w-full bottom-[14px] h-[15px] bg-white dark:bg-[#1f2030]'></div>
            </div >
          </Card>
          <div className="flex items-center">
            <Heading title={popup} sub="Date" className="mx-4 pr-8 border-r border-white/20" />
            <Heading title={marketName} sub="Protocol" className="mx-4 pr-8 border-r border-white/20" />
            <Heading title={Number(userSummary?.healthFactor).truncateDecimals(2) !== -1.00 ? Number(userSummary?.healthFactor).truncateDecimals(2) : "∞"} sub="Health Factor" className="mx-4 pr-8 border-r border-white/20" />
            <Heading title={eModes[userEmodeCategoryId]} sub="E-Mode" className="mx-4 pr-8 border-r border-white/20" />
            <Heading title={actionsCount * averageGasPerAction + " " + gasToken} sub="Gas used" className="mx-4 pr-8 border-r border-white/20" />
            {/* <Heading title={rangeValue < lastKey ? "Disabled" : "Enabled"} sub="Add an action" className="mx-4 pr-8 border-r border-white/20" /> */}
            <ButtonOutlined className={'px-1 text-xs'} label="Edit Gas" disabled={disable} onClick={() => onOpenGasModal()} />
            <ButtonOutlined className={'ml-4 px-1 text-xs'} label="Change eMode" disabled title="Coming soon" />
            <div class="ml-auto">
              <ButtonOutlined className={'px-1 text-xs'} label="Reset Actions" disabled={disable} onClick={() => onOpenResetModal()} />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-5 grid-flow-row">
            <div className="col-span-8">
              <div className="grid grid-cols-12 gap-5">
                <div className='col-span-6'>
                  <Card className="py-2 px-2 mb-6">
                    <h3 className="font-bold mb-2 text-gray-dark dark:text-white">Your Supplies</h3>
                    <table className="table-auto w-full">
                      <thead>
                        <tr className="text-left text-xxs border-b border-light-hover dark:border-gray-700">
                          <th className="py-2" width="200">
                            Asset
                          </th>
                          <th className="py-2" width="100">
                            Balance
                          </th>
                          <th width="50" className="py-2 text-center">
                            APY
                          </th>
                          <th width="50" className="py-2 text-center">
                            Collateral
                          </th>
                          <th className="py-2 text-center">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userSummary && userSummary.userReservesData.map((userReserveData, indexData) => {
                          if (userReserveData.underlyingBalance != 0) {
                            return (
                              <tr key={"userReserves" + indexData} className="border-b text-xs border-light-hover dark:border-gray-700">
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <Image src={"/icons/tokens/" + userReserveData.reserve.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" alt="token" />
                                    <p className="ml-3">{userReserveData.reserve.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <p>{Formator.formatNumber(userReserveData.underlyingBalance)}</p>
                                  <p className="text-xs text-gray-500">{Formator.formatCurrency(userReserveData.underlyingBalanceUSD)}</p>
                                </td>
                                <td className="py-2 text-center">
                                  <p>{(Number(userReserveData.reserve.supplyAPY) * 100).toFixed(2) + "%"}</p>
                                  {/* {userReserveData.reserve.aIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(userReserveData.reserve.aIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                </td>
                                <td className="py-4 text-center justify-center flex items-center">
                                  {userReserveData.usageAsCollateralEnabledOnUser ? (
                                    <CheckIcon className="h-4 w-4 text-green-pistachio" />
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td>
                                  <div className="flex gap-1 justify-between">
                                    <ButtonOutlined className={'px-1 text-xs'} label="Withdraw" onClick={() => onOpenWithDrawModal(userReserveData)} disabled={disable || rangeValue < lastKey} />
                                    <ButtonOutlined className={'px-1 text-xs'} label="Swap" onClick={() => onOpenSwapSupplyModal(userReserveData)} disabled={disable || rangeValue < lastKey} />
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </Card>
                  <Card className="py-2 px-2 mb-6">
                    <h3 className="font-bold mb-2 text-gray-dark dark:text-white">Assets to supply</h3>
                    <div className="text-sm text-gray-dark dark:text-white">
                      <BtnSwitch title="Show assets with 0 balance" className="mb-1 mt-2 relative z-0" name="displayall" setValue={setDisplayAllAssetsToSupply} value={displayAllAssetsToSupply} /></div>
                    <table className="table-auto w-full">
                      <thead>
                        <tr className="text-left text-xxs border-b border-light-hover dark:border-gray-700">
                          <th className="py-2" width="150">
                            Asset
                          </th>
                          <th className="py-2" width="100">
                            Balance
                          </th>
                          <th width="100" className="py-2 text-center">
                            APY
                          </th>
                          <th width="100" className="py-2 text-center">
                            Collateral
                          </th>
                          <th className="py-2 text-center">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetsToSupply && assetsToSupply.map((asset, index) => {

                          if (displayAllAssetsToSupply === true || asset.availableToDeposit > 0) {
                            return (
                              <tr className="border-b text-xs border-light-hover dark:border-gray-700" key={"assetSupply" + index}>
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <Image src={"/icons/tokens/" + asset.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                    <p className="ml-3">{asset.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <p>{Formator.formatNumber(asset.walletBalance)}</p>
                                  <p className="text-xs text-gray-500">{Formator.formatCurrency(asset.walletBalance * asset.priceInUSD
                                  )}</p>
                                </td>
                                <td className="py-2 text-center">
                                  <p>{(Number(asset.supplyAPY) * 100).toFixed(2) + " %"}</p>
                                  {/* {asset.aIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(asset.aIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                </td>
                                <td className="py-4 text-center justify-center flex items-center">{asset.usageAsCollateralEnabledOnUser ? <CheckIcon className="h-4 w-4 text-green-pistachio" /> : "-"}</td>
                                <td>
                                  <div className="flex gap-1 justify-between">
                                    <ButtonOutlined
                                      className={'px-2 text-xs'}
                                      label="Supply"
                                      onClick={() => onOpenSupplyModal(asset)}
                                      disabled={disable && rangeValue < lastKey || asset.availableToDeposit <= 0}
                                    />
                                    <ButtonOutlined className={'px-2 text-xs'} label="Add" onClick={() => onOpenAddModal(asset)} disabled={disable && rangeValue < lastKey} />
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        })}
                      </tbody>
                    </table>
                  </Card>
                </div>
                <div className='col-span-6'>
                  <Card className="py-2 px-2 mb-6">
                    <h3 className="font-bold mb-2 text-gray-dark dark:text-white">Your Borrows</h3>
                    <table className="table-auto w-full">
                      <thead>
                        <tr className="text-left text-xxs border-b border-light-hover dark:border-gray-700">
                          <th className="py-2" width="200">
                            Asset
                          </th>
                          <th className="py-2" width="100">
                            Balance
                          </th>
                          <th width="50" className="py-2 text-center">
                            APY
                          </th>
                          <th width="100" className="py-2 text-center">
                            API Type
                          </th>
                          <th className="py-2 text-center">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userSummary && userSummary.userReservesData.map((userReserveData, indexData) => {
                          if (userReserveData.stableBorrows != 0 && userReserveData.variableBorrows != 0) {
                            return (
                              <Fragment key={"userReservesVariable" + indexData}>
                                <tr className="border-b text-xs border-light-hover dark:border-gray-700">
                                  <td className="py-2">
                                    <div className="flex items-center">
                                      <Image src={"/icons/tokens/" + userReserveData.reserve.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                      <p className="ml-3">{userReserveData.reserve.symbol}</p>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <p>{Formator.formatNumber(userReserveData.variableBorrows)}</p>
                                    <p className="text-xs text-gray-500">{Formator.formatCurrency(userReserveData.variableBorrowsUSD)}</p>
                                  </td>

                                  <td className="py-2 text-center">
                                    <p>{(Number(userReserveData.reserve.variableBorrowAPY) * 100).toFixed(2) + " %"}</p>
                                    {/* {userReserveData.reserve.vIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(userReserveData.reserve.vIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                  </td>
                                  <td className="py-2 text-center text-xs">{userReserveData.variableBorrows !== "0" ? "Variable" : "Stable"}</td>
                                  <td>
                                    <div className="flex gap-1 justify-between">
                                      <ButtonOutlined className={'px-2 text-xs'} label="Repay" onClick={() => onOpenRepayModal(userReserveData, "variable")} disabled={disable || rangeValue < lastKey}
                                      />
                                    </div>
                                  </td>
                                </tr>
                                <tr key={"userReservesStable" + indexData} className="border-b text-xs border-light-hover dark:border-gray-700">
                                  <td className="py-2">
                                    <div className="flex items-center">
                                      <Image src={"/icons/tokens/" + userReserveData.reserve.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                      <p className="ml-3">{userReserveData.reserve.symbol}</p>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <p>{Formator.formatNumber(userReserveData.stableBorrows)}</p>
                                    <p className="text-xs text-gray-500">{Formator.formatCurrency(userReserveData.stableBorrowsUSD)}</p>
                                  </td>
                                  <td className="py-2 text-center">
                                    <p>{(Number(userReserveData.reserve.stableBorrowAPY) * 100).toFixed(2) + " %"}</p>
                                    {/* {userReserveData.reserve.sIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(userReserveData.reserve.sIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                  </td>
                                  <td className="py-2 text-center text-xs">{userReserveData.stableBorrows !== "0" ? "Stable" : "Variable"}</td>
                                  <td>
                                    <div className="flex gap-1 justify-between">
                                      <ButtonOutlined className={'px-2 text-xs'} label="Repay" onClick={() => onOpenRepayModal(userReserveData, "stable")} disabled={disable || rangeValue < lastKey}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          }
                          if (userReserveData.variableBorrows != 0) {
                            return (
                              <tr key={"userReserves" + indexData} className="border-b text-xs border-light-hover dark:border-gray-700">
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <Image src={"/icons/tokens/" + userReserveData.reserve.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                    <p className="ml-3">{userReserveData.reserve.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <p>{Formator.formatNumber(userReserveData.variableBorrows)}</p>
                                  <p className="text-xs text-gray-500">{Formator.formatCurrency(userReserveData.variableBorrowsUSD)}</p>
                                </td>
                                <td className="py-2 text-center">
                                  <p>{(Number(userReserveData.reserve.variableBorrowAPY) * 100).toFixed(2) + " %"}</p>
                                  {/* {userReserveData.reserve.vIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(userReserveData.reserve.vIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                </td>
                                <td className="py-2 text-center text-xs">{userReserveData.variableBorrows !== "0" ? "Variable" : "Stable"}</td>
                                <td>
                                  <div className="flex gap-1 justify-between">
                                    <ButtonOutlined className={'px-2 text-xs'} label="Repay" onClick={() => onOpenRepayModal(userReserveData, 'variable')} disabled={disable || rangeValue < lastKey}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          if (userReserveData.stableBorrows != 0) {
                            return (
                              <tr key={"userReserves" + indexData} className="border-b border-light-hover dark:border-gray-700 text-xs">
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <Image src={"/icons/tokens/" + userReserveData.reserve.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                    <p className="ml-3">{userReserveData.reserve.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-2">
                                  <p>{Formator.formatNumber(userReserveData.stableBorrows)}</p>
                                  <p className="text-xs text-gray-500">{Formator.formatCurrency(userReserveData.stableBorrowsUSD)}</p>
                                </td>
                                <td className="py-2 text-center">
                                  <p>{(Number(userReserveData.reserve.stableBorrowAPY) * 100).toFixed(2) + " %"}</p>
                                  {/* {userReserveData.reserve.vIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(userReserveData.reserve.vIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                </td>
                                <td className="py-2 text-center text-xs">{userReserveData.stableBorrows !== "0" ? "Stable" : "Variable"}</td>
                                <td>
                                  <div className="flex gap-1 justify-between">
                                    <ButtonOutlined className={'px-2 text-xs'} label="Repay" disabled={disable || rangeValue < lastKey} />
                                    <ButtonOutlined className={'px-2 text-xs'} label="Borrow" onClick={() => onOpenBorrowModal(userReserveData)} disabled={disable || rangeValue < lastKey} />
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                        })}
                      </tbody>
                    </table>
                  </Card>
                  <Card className="py-2 px-2 mb-6">
                    <h3 className="font-bold mb-2 text-gray-dark dark:text-white">Assets to borrow</h3>
                    <table className="table-auto w-full">
                      <thead>
                        <tr className="text-left text-xxs border-b border-light-hover dark:border-gray-700">
                          <th className="py-2" width="150">
                            Asset
                          </th>
                          <th className="py-2" width="100">
                            Balance
                          </th>
                          <th width="100" className="py-2 text-center">
                            APY stable
                          </th>
                          <th width="100" className="py-2 text-center">
                            APY variable
                          </th>
                          <th className="py-2 text-center">
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {assetsToBorrow && assetsToBorrow.map((asset, index) => {
                          if (asset.availableToDeposit != 0) {
                            return (
                              <tr className="border-b text-xs border-light-hover dark:border-gray-700" key={"assetSupply" + index}>
                                <td className="py-2">
                                  <div className="flex items-center">
                                    <Image src={"/icons/tokens/" + asset.iconSymbol.toLowerCase() + ".svg"} width="20" height="20" />
                                    <p className="ml-3">{asset.symbol}</p>
                                  </div>
                                </td>
                                <td className="py-2">{Formator.formatNumber(asset.availableBorrows)}</td>
                                <td className="py-2 text-center">{asset.stableBorrowRate > 0 ? (Number(asset.stableBorrowRate) * 100).toFixed(3) + " %" : "-"}</td>
                                <td className="py-2 text-center">
                                  <p>{(Number(asset.variableBorrowAPY) * 100).toFixed(2) + " %"}</p>
                                  {/* {asset.vIncentivesData[0]?.incentiveAPR > 0 ? <span className="text-xs border border-light-hover dark:border-white/30 p-1 rounded-md">{(Number(asset.vIncentivesData[0]?.incentiveAPR) * 100).toFixed(3) + " %"}</span> : null} */}
                                </td>
                                <td>
                                  <div className="flex gap-1 justify-between">
                                    <ButtonOutlined className={'px-2 text-xs'} label="Borrow" disabled={disable || rangeValue < lastKey} onClick={() => onOpenBorrowModal(asset)} />
                                  </div>
                                </td>
                              </tr>
                            )
                          }
                        })}
                      </tbody>
                    </table>
                  </Card>
                </div>
              </div>
            </div>
            <div className='col-span-4'>
              <Card className={'h-[510px]'}>
                {displayChart ? (<ScrollToSelected data={utilData} selectedDate={selectedDate} rangeValue={rangeValue} />) : null}
              </Card>
            </div>
          </div>
        </>
      }
      <ModalLoading open={loading} setOpen={setLoading} redirect="reload" timer="12000000" />
      <Supply open={openModal && openSupply ? true : false} onClose={onCloseSupplyModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} lastHour={lastHour} setLastHour={setLastHour} />
      <Add open={openModal && openAdd ? true : false} onClose={onCloseAddModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} lastHour={lastHour} setLastHour={setLastHour} />
      <Withdraw open={openModal && openWithDraw ? true : false} onClose={onCloseWithDrawModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} lastHour={lastHour} setLastHour={setLastHour} />
      <SwapSupply open={openModal && openSwapSupply ? true : false} onClose={onCloseSwapSupplyModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} lastHour={lastHour} setLastHour={setLastHour} />
      <Repay open={openModal && openRepay ? true : false} onClose={onCloseRepayModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} assetsToSupply={assetsToSupply} userEmodeCategoryId={userEmodeCategoryId} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} typeBorrow={typeBorrow} lastHour={lastHour} setLastHour={setLastHour} />
      <Borrow open={openModal && openBorrow ? true : false} onClose={onCloseBorrowModal} modalData={modalData} selectedDate={selectedDate} userSummary={userSummary} simulationData={simulationData} rangeValue={rangeValue} setSimulationActions={setSimulationActions} simulationActions={simulationActions} lastHour={lastHour} setLastHour={setLastHour} />
      <Gas open={openModal && openGas ? true : false} onClose={onCloseGasModal} gasToken={gasToken} averageGasPerAction={averageGasPerAction} setAverageGasPerAction={setAverageGasPerAction} />
      <Reset open={openModal && openReset ? true : false} onClose={onCloseResetModal} reset={resetActions} />
    </MainLayout>
  );
}
ViewSimulation.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};