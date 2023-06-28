import MainLayout from '../../../layouts/mainLayout';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Card from '../../../components/Card';
import Image from "next/image";
import Link from "next/link";
import UpdownBadge from "../../../components/badges/UpdownBadge";
import StatusText from "../../../components/paragraph/StatusText";
import { Maths } from "../../../utils/maths";
import ActionsTable from '../../../blocks/tables/ActionsTable';

import SummaryLine from '../../../blocks/charts/summary/SummaryLine';
import SummaryCircle from '../../../blocks/charts/summary/SummaryCircle';
import { Formator } from "../../../utils/formator";

import { getPagingQueryParams, queryStringify } from '../../../utils/query';
import useQuery from '../../../hooks/useQuery';
import filledUP from '../../../assets/icons/filled-up.svg';
import filledDOWN from '../../../assets/icons/filled-down.svg';
import arrowRight from '../../../assets/icons/arrow-right.svg';
import arrowDownIcon from '../../../assets/icons/arrow-down.svg';
import axios from "axios";
import moment from "moment";
import AaveOffline from "../../../service/aave_offline";
import Aave from "../../../service/aave";

const portfolioOptions = [
  {
    id: 1,
    value: 'portfolio_value',
    label: "Portfolio value"
  },
  {
    id: 2,
    value: 'to_supply',
    label: "To supply"
  }
]
const initialQeryState = {
  active_tab: 'actions',
  order_by: '',
  sort: 'desc',
}
export default function ViewSummarySimulation() {
  const router = useRouter();
  const query = useQuery();
  const { simulationId } = router.query;
  // const { user } = useUser();
  const [data, setData] = useState(false);
  const [market, setMarket] = useState('');
  const [simulationActions, setSimulationActions] = useState([]);
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(0);
  const [startHF, setStartHF] = useState(0);
  const [endHF, setEndHF] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState(false);
  const [portfolioDebt, setPortfolioDebt] = useState(false);
  const [portfolioCollateral, setPortfolioCollateral] = useState(false);
  const [portfolioHealthFactor, setPortfolioHealthFactor] = useState(false);
  const [tokenPositions, setTokenPositions] = useState([]);
  const [simulationData, setSimulationData] = useState([]);
  const [riskLiquidation, setRiskLiquidation] = useState('Low');
  const [labelsStart, setLabelsStart] = useState([]);
  const [labelsEnd, setLabelsEnd] = useState([]);

  const [availableBorrowsUSDStart, setAvailableBorrowsUSDStart] = useState(0);
  const [totalBorrowsUSDStart, setTotalBorrowsUSDStart] = useState(0);
  const [totalCollateralUSDStart, setTotalCollateralUSDStart] = useState(0);

  const [availableBorrowsUSDPctStart, setAvailableBorrowsUSDPctStart] = useState(0);
  const [totalBorrowsUSDPctStart, setTotalBorrowsUSDPctStart] = useState(0);
  const [totalCollateralUSDPctStart, setTotalCollateralUSDPctStart] = useState(0);

  const [availableBorrowsUSDEnd, setAvailableBorrowsUSDEnd] = useState(0);
  const [totalBorrowsUSDEnd, setTotalBorrowsUSDEnd] = useState(0);
  const [totalCollateralUSDEnd, setTotalCollateralUSDEnd] = useState(0);

  const [availableBorrowsUSDPctEnd, setAvailableBorrowsUSDPctEnd] = useState(0);
  const [totalBorrowsUSDPctEnd, setTotalBorrowsUSDPctEnd] = useState(0);
  const [totalCollateralUSDPctEnd, setTotalCollateralUSDPctEnd] = useState(0);

  const [summaryPerActions, setSummaryPerActions] = useState([]);
  const [portfolioSeries, setPortfolioSeries] = useState([]);
  const [daysSeries, setDaysSeries] = useState([]);

  const [utilData, setUtilData] = useState();
  const initialQueryParams = getPagingQueryParams(query, initialQeryState);
  const [searchValue, setSearchValue] = useState("");
  const [queryState, setQueryState] = useState({
    active_tab: initialQueryParams.active_tab,
    order_by: initialQueryParams.order_by,
    sort: initialQueryParams.sort
  });
  const aaveOffline = new AaveOffline();
  const aave = new Aave();
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
  switch (market) {
    case "mainnet_v3":
        var marketName = 'Ethereum';
        var gasToken = 'ETH';
        var eModes = ['Disabled','ETH correlated']
        break;
    case "polygon_v3":
        var marketName = 'Polygon';
        var gasToken = 'MATIC';
        var eModes = ['Disabled','Stablecoins','MATIC correlated']
        break;
    case "fantom_v3":
        var marketName = 'Fantom';
        var gasToken = 'ETH';
        var eModes = ['Disabled','Stablecoins']
        break;
    case "arbitrum_v3":
        var marketName = 'Arbitrum';
        var gasToken = 'ETH';
        var eModes = ['Disabled','Stablecoins','ETH correlated']
        break;
    case "optimism_v3":
        var marketName = 'Optimism';
        var gasToken = 'ETH';
         var eModes = ['Disabled','Stablecoins']
        break;
    case "avalanche_v3":
        var marketName = 'Avalanche';
        var gasToken = 'AVAX';
        var eModes = ['Disabled','Stablecoins','AVAX correlated']
        break;
    case "harmony_v3":
        var marketName = 'Harmony';
        var gasToken = 'ONE';
        var eModes = ['Disabled','Stablecoins']
        break;
    default:
        var marketName = 'Ethereum';
        var gasToken = 'ETH';
         var eModes = ['Disabled','ETH correlated']
        break;
}
  const generateReport = async (data) => {

    setSummaryPerActions([]);
    setPortfolioSeries([]);
    setDaysSeries([]);

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
              //pour chaque reseau trouver le wrapped
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
                    //let qty = 100000000;
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
                    console.log(actionItem.action, 'actionItem.action.type');

                    if (actionItem.action.typeBorrow == 'stable') {
                      matchingReserve.principalStableDebt = actionItem.action.token_a_qty * Math.pow(10, matchingReserve.decimals);
                    }
                    else {
                      let BaseScaledVariableDebt = matchingReserve.scaledVariableDebt / Math.pow(10, matchingReserve.reserve.decimals);
                      matchingReserve.scaledVariableDebt = qtyFinal;
                    }
                    if (actionItem.action.token_b_from == 'collateral') {
                      //collateral
                      var matchingReserveRepayWith = currentUserReserve.find(reserveData => reserveData.reserve.symbol === actionItem.action.token_b);
                      let baseScaledATokenBalance = matchingReserveRepayWith.scaledATokenBalance / Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                      let liquidityIndex = matchingReserveRepayWith.reserve.liquidityIndex / Math.pow(10, 27);
                      let qty = actionItem.action.token_b_qty;
                      let qtyScaled = qty * liquidityIndex;
                      let finalScaledATokenBalance = baseScaledATokenBalance - qtyScaled;
                      matchingReserveRepayWith.scaledATokenBalance = finalScaledATokenBalance * Math.pow(10, matchingReserveRepayWith.reserve.decimals);
                    }
                    else {
                      //wallet
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
                    if (actionItem.action.type_borrow == 'variable') {
                      //variable
                      let baseScaledVariableDebt = matchingReserve.scaledVariableDebt / Math.pow(10, matchingReserve.reserve.decimals);
                      let variableBorrowIndex = matchingReserve.reserve.variableBorrowIndex / Math.pow(10, 27);
                      let qty = actionItem.action.token_a_qty;
                      let qtyScaled = qty * variableBorrowIndex
                      let finalScaledVariableDebt = baseScaledVariableDebt + qtyScaled;
                      matchingReserve.scaledVariableDebt = finalScaledVariableDebt * Math.pow(10, matchingReserve.reserve.decimals);
                    }
                    else {
                      let baseScaledATokenBalance = matchingReserve.scaledATokenBalance / Math.pow(10, matchingReserve.reserve.decimals);
                      let qty = actionItem.action.token_a_qty;
                      let finalATokenBalance = baseScaledATokenBalance + qty;
                      matchingReserve.scaledATokenBalance = finalATokenBalance * Math.pow(10, matchingReserve.reserve.decimals);
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
              let day = moment(data?.projection?.startDate).add(i, 'd').format("MM.DD.YYYY");

              // Créer un objet contenant les valeurs à ajouter
              const actionValues = {
                id: actionItem.id,
                actionName: actionItem.actionName,
                actionDetails: actionItem.actionDetails,
                day: day,
                hour: Formator.convertSecondsToTime(actionItem.actionSeconds),
                reserve: currentUserReserveCopy,
                formattedPoolReserves: currentFormattedPoolReserves,
                walletBalances: walletBalancesCopy[i]
              };
              console.log(actionValues.actionName, 'valeur !');
              // Vérifier si l'id existe déjà dans userProjectionsActions

              // Ajouter les nouvelles valeurs à userProjectionsActions
              userProjectionsActions[actionItem.id] = actionValues;

              // Ajouter une copie de l'objet contenant les nouvelles valeurs à summaryPerActions
              setSummaryPerActions(prevSummaryPerActions => [...prevSummaryPerActions, { ...actionValues }]);

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

      for (let i = 0; i < userProjectionsEND.length; i++) {
        if (userProjectionsEND[i].summary && userProjectionsEND[i].summary.healthFactor) {
          if (userProjectionsEND[i].summary.healthFactor < 1.1 && userProjectionsEND[i].summary.healthFactor != -1.00) {
            setRiskLiquidation('High');
          }
        }
      }


      const labelsChart = dates;
      setStartValue(Number(userProjectionsEND[0].summary.netWorthUSD).toFixed(2));
      setEndValue(Number(userProjectionsEND[dates.length - 1].summary.netWorthUSD).toFixed(2));
      setStartHF(Number(userProjectionsEND[0].summary.healthFactor).toFixed(2));
      setEndHF(Number(userProjectionsEND[dates.length - 1].summary.healthFactor).toFixed(2));

      let availableBorrowsUSDStart = Number(userProjectionsEND[0].summary.availableBorrowsUSD).toFixed(2)
      let totalBorrowsUSDStart = Number(userProjectionsEND[0].summary.totalBorrowsUSD).toFixed(2);
      let totalCollateralUSDStart = Number(userProjectionsEND[0].summary.totalCollateralUSD).toFixed(2);



      let sum = Number(totalCollateralUSDStart);

      let v1 = Number((availableBorrowsUSDStart / sum) * 100).truncateDecimals(2);
      let v3 = Number((totalCollateralUSDStart / sum) * 100).truncateDecimals(2);
      let v2 = Number((totalBorrowsUSDStart / sum) * 100).truncateDecimals(2);

      setAvailableBorrowsUSDStart(Number(availableBorrowsUSDStart).truncateDecimals(2))
      setTotalBorrowsUSDStart(Number(totalBorrowsUSDStart).truncateDecimals(2))
      setTotalCollateralUSDStart(Number(totalCollateralUSDStart).truncateDecimals(2))

      setAvailableBorrowsUSDPctStart(v1)
      setTotalBorrowsUSDPctStart(v2)
      setTotalCollateralUSDStart(v3)

      setLabelsStart(['To borrow', 'Debt']);

      let availableBorrowsUSDEnd = userProjectionsEND[dates.length - 1].summary.availableBorrowsUSD;
      let totalBorrowsUSDEnd = userProjectionsEND[dates.length - 1].summary.totalBorrowsUSD;
      let totalCollateralUSDEnd = userProjectionsEND[dates.length - 1].summary.totalCollateralUSD;

      let sum2 = Number(totalCollateralUSDEnd)

      let w1 = Number((availableBorrowsUSDEnd / sum2) * 100).truncateDecimals(2);
      let w3 = Number((totalCollateralUSDEnd / sum2) * 100).truncateDecimals(2);
      let w2 = Number((totalBorrowsUSDEnd / sum2) * 100).truncateDecimals(2);

      setAvailableBorrowsUSDEnd(Number(availableBorrowsUSDEnd).truncateDecimals(2))
      setTotalBorrowsUSDEnd(Number(totalBorrowsUSDEnd).truncateDecimals(2))
      setTotalCollateralUSDEnd(Number(totalCollateralUSDEnd).truncateDecimals(2))

      setAvailableBorrowsUSDPctEnd(w1)
      setTotalBorrowsUSDPctEnd(w2)
      setTotalCollateralUSDPctEnd(w3)

      setLabelsEnd(['To Borrow', 'Debt']);

      let newPortfolioValues = [];
      let newDays = [];
      let j = 0;

      userProjectionsEND.forEach(function (dayValue) {
        j++;
        let portfolioValue = Number(dayValue.summary.netWorthUSD).truncateDecimals(3);
        let day = moment(data?.projection?.startDate).add(j, 'days').format("MM.DD.YYYY");

        newPortfolioValues.push(portfolioValue);
        newDays.push(day);
      });

      setPortfolioSeries((prevValues) => [...prevValues, ...newPortfolioValues]);
      setDaysSeries((prevDays) => [...prevDays, ...newDays]);

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
        /*
        if (i == 0) {
          //test i == 0
        }
        if (i == 1) {
        }
        if (i == 20) {
        }
        */
        let assetsToBorrowData = aaveOffline.getAssetsToBorrow(currentFormattedPoolReserves, summaryValue, market, marketReferenceCurrencyPriceInUsd);
        simulationDataArr.push({ assetsToBorrowData, assetsToSupplyData, userProjection: element, currentFormattedPoolReserves, baseCurrencyData, userEmodeCategoryId });
      }
      setSimulationData(simulationDataArr);
      transformArray(userProjections.map((reserveData) => parseFloat(reserveData.summary.netWorthUSD)), data.startDate, simulationActions);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (simulationId) {
      axios.post("/api/simulation/read", { simulationId })
        .then(function (result) {
          if (!data) {
            setData(result.data[0]);
            setSimulationActions(result.data[0].actions);
            setTokenPositions(result.data[0].tokenPositions);
            setMarket(result.data[0].projectionPositions.market);
  
          }
         
        })
    }
  }, [data, simulationId])

  useEffect(() => {
    const queryParams = {
      active_tab: queryState.active_tab,
      order_by: queryState.order_by,
      sort: queryState.sort
    };
    const queryString = queryStringify(queryParams);
    //router.push(`/simulation/summary/test/${queryString}`);
  }, [queryState, router]);
  const onSort = (sortKey) => {
    if (queryState.order_by !== sortKey) {
      return setQueryState({ ...queryState, order_by: sortKey, sort: 'asc' })
    }
    setQueryState({
      ...queryState, order_by: sortKey, sort: queryState.sort === 'asc' ? 'desc' : 'asc'
    })
  }
  const onChangeTab = (key) => {
    setQueryState({ ...queryState, order_by: '', active_tab: key })
  };
  const onChangeSearch = (e) => {
    setSearchValue(e.target.value);
  };
  const onChangeRange = () => {
  };
  const onSelectPortfolio = (id) => {
    const selected = portfolioOptions.find(item => item.id === id);
    setPortfolioValue(selected);
  }
  let percentageChange = ((endValue - startValue) / startValue) * 100;
  let percentageChangeHF = ((endHF - startHF) / startValue) * 100;


  useEffect(() => {
    generateReport(data);
  }, [simulationActions])
  useEffect(() => {
    //todo
  }, [summaryPerActions])


  return (
    <MainLayout id="summary-page">
      <div className="flex justify-between mb-4">
      <div className="flex mb-4">
      <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{data?.name}</h1>
      <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{marketName} Aave V3</h1>
                <h1 className="text-gray-dark dark:text-white overflow-hidden font-medium pr-8 ml-4 mr-8 border-r border-white/20 w-auto">{data?.displayAddress}</h1>
    </div>
        <Link href={`/simulation/view/${simulationId}`}>
          <button className="ml-4 px-4 cursor-pointer text-center text-sm font-medium font-inter py-2 rounded-md bg-blue-crayola text-white hover:bg-blue-tiful focus:outline-none focus:ring focus:ring-blue-tiful-300 step_7">
            Edit Simulation
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3">
          <Card className="py-4 flex items-center">
            <div className="w-1/3 px-4">
              <div className="text-gray-light text-xxs">Net worth - start state</div>
              <div className="text-gray-dark dark:text-white text-xl font-semibold mt-1">{startValue} $</div>
            </div>
            <div className="w-1/3 border-l border-l-gray-dark px-4">
              <div className="text-gray-light text-xxs">Net worth - end state</div>
              <div className=" mt-1 flex items-center gap-2">
                <div className="text-gray-dark dark:text-white text-xl font-semibold">{endValue} $</div>
                {startValue < endValue ? (
                  <Image src={filledUP} alt="up" />
                ) : (
                  <Image src={filledDOWN} alt="down" />
                )}
              </div>
            </div>
            <div className="w-1/3 border-l border-l-gray-dark px-4">
              <div className="text-gray-light text-xxs">Health factor</div>
              <div className="mt-1 flex items-center gap-3.5">
  <div className="text-gray-dark dark:text-white text-xl font-semibold">
    {startHF === -1.00 || startHF >= 100 ? "∞" : startHF}
  </div>
  <Image src={arrowRight} alt="arrow-right" />
  <div className="text-gray-dark dark:text-white text-xl font-semibold">
    {endHF === -1.00 || endHF >= 100 ? "∞" : endHF}
  </div>
  {(startHF !== -1.00 && startHF < 100 && endHF !== -1.00 && endHF < 100) && (
    <>
      {percentageChangeHF >= 0 ? (
        <UpdownBadge up>{percentageChangeHF.toFixed(2)}%</UpdownBadge>
      ) : (
        <UpdownBadge down>{percentageChangeHF.toFixed(2)}%</UpdownBadge>
      )}
    </>
  )}
</div>
            </div>
          </Card>
          <Card className="p-4 mt-4">
            <div className='text-gray-dark dark:text-white text-xs'>Portfolio evolution {moment(data?.projection?.startDate).format("MM.DD.YYYY")} &gt; {moment(data?.projection?.endDate).format("MM.DD.YYYY")}</div>
            <SummaryLine daysSeries={daysSeries} portfolioSeries={portfolioSeries} />
          </Card>
        </div>
        <div className="col-span-2 h-full flex flex-col">
          <div className="flex gap-4">
            <Card className="w-1/2 p-4">
              <div className="text-xxs text-gray-light">Risk of liquidation</div>
              <div className="text-gray-dark dark:text-white text-xl font-semibold mt-1">{riskLiquidation}</div>
            </Card>
            <Card className="w-1/2 p-4">
              <div className="text-xxs text-gray-light">Portfolio evolution</div>
              <div className="text-xl font-bold mt-1 flex items-center justify-start gap-2">
                {percentageChange >= 0 ? (
                  <StatusText className="font-bold" up>+</StatusText>
                ) : (
                  <StatusText className="font-bold" down>-</StatusText>
                )}
                <div className="text-gray-dark dark:text-white text-xl font-semibold">{percentageChange.toFixed(2)}%</div>
              </div>
            </Card>
          </div>
          <Card className="p-4 mt-4 h-[399px] grow">
            <div className='flex items-center gap-2 mb-3'>
              <div className='text-gray-dark dark:text-white text-xs'>Allocation</div>
              <div className='rounded bg-blue-crayola/10 p-1 text-xxs text-blue-crayola'>2</div>
            </div>
            <div className='flex flex-wrap items-center justify-between'>
              <SummaryCircle title="Start state" labels={labelsStart} series={[availableBorrowsUSDPctStart, totalBorrowsUSDPctStart]} data={[availableBorrowsUSDStart, totalBorrowsUSDStart, totalCollateralUSDStart]} />
              <SummaryCircle title="End state" labels={labelsEnd} series={[availableBorrowsUSDPctEnd, totalBorrowsUSDPctEnd]} data={[availableBorrowsUSDEnd, totalBorrowsUSDEnd, totalCollateralUSDEnd]} />
            </div>

          </Card>
        </div>
      </div>
      <Card className="mt-4 p-4">
        {summaryPerActions ? <ActionsTable sort={queryState.sort} order_by={queryState.order_by} onSort={onSort} values={summaryPerActions} /> : null}


      </Card>
    </MainLayout>
  )
}