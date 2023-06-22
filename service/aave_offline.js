import { UiPoolDataProvider, UiIncentiveDataProvider, ChainId, WalletBalanceProvider, UserReserveDataHumanized, API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import { valueToBigNumber, nativeToUSD, normalize, USD_DECIMALS, formattedPriceInMarketReferenceCurrency, formatReserves, formatUserSummary, formatReservesAndIncentives, formatUserSummaryAndIncentives } from "@aave/math-utils";
import dayjs from "dayjs";
import BigNumber from "bignumber.js";
import { fetchIconSymbolAndName } from "../utils/reserve";
import * as markets from '@bgd-labs/aave-address-book';
class AaveOffline {
  constructor() {
this.InterestRate = {
  None: "None",
  Stable: "Stable",
  Variable: "Variable",
};
  }


getUserSummary(position, dbFormattedPoolReserves, dbBaseCurrencyData,dbUserEmodeCategoryId) {

    const currentTimestamp = dayjs().unix();

    const userSummary = formatUserSummary({
      currentTimestamp,
      marketReferencePriceInUsd: dbBaseCurrencyData.marketReferenceCurrencyPriceInUsd,
      marketReferenceCurrencyDecimals: dbBaseCurrencyData.marketReferenceCurrencyDecimals,
      userReserves: position.reserve,
      formattedReserves: dbFormattedPoolReserves,
      userEmodeCategoryId: dbUserEmodeCategoryId,
    });
    return userSummary;
  }

getUserSummaryPositions(positions, dbFormattedPoolReserves, dbBaseCurrencyData,dbUserEmodeCategoryId) {
  
  let formattedPoolReserves;
  let baseCurrencyData;
    formattedPoolReserves = dbFormattedPoolReserves;
    baseCurrencyData = dbBaseCurrencyData;
  const currentTimestamp = dayjs().unix();

  if (positions.length > 0) {
    positions.map((position) => {
      let formated = position.reserve.map((reserve, index) => {
        let formatedPrice = formattedPoolReserves[index];
        formatedPrice.formattedPriceInMarketReferenceCurrency = reserve.reserve.formattedPriceInMarketReferenceCurrency;
        formatedPrice.priceInUSD = reserve.reserve.priceInUSD;
        formatedPrice.priceInMarketReferenceCurrency = reserve.reserve.priceInMarketReferenceCurrency;
        return { ...formatedPrice, reserve };
      });
      position.summary = formatUserSummary({
        currentTimestamp,
        marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
        marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
        userReserves: position.reserve,
        formattedReserves: formated,
        userEmodeCategoryId: dbUserEmodeCategoryId, 
      });
      
      position.summary.userEmodeCategoryId = dbUserEmodeCategoryId;
      position.summary.isInEmode = dbUserEmodeCategoryId !== 0;
      
    });
  }
  else {
  
  }
  
  return positions;
}
assetCanBeBorrowedByUser({ borrowingEnabled, isActive, borrowableInIsolation, eModeCategoryId, isFrozen }, user) {
  if (!borrowingEnabled || !isActive || isFrozen) return false;
  if (user?.isInEmode && eModeCategoryId !== user.userEmodeCategoryId) return false;
  if (user?.isInIsolationMode && !borrowableInIsolation) return false;
  return true;
}
getMaxAmountAvailableToBorrow(poolReserve, user, rateMode) {
  const availableInPoolUSD = poolReserve.availableLiquidityUSD;
  const availableForUserUSD = BigNumber.min(user.availableBorrowsUSD, availableInPoolUSD);
  let maxUserAmountToBorrow = BigNumber.min(valueToBigNumber(user?.availableBorrowsMarketReferenceCurrency || 0).div(poolReserve.formattedPriceInMarketReferenceCurrency), poolReserve.formattedAvailableLiquidity);
  if (rateMode === this.InterestRate.Stable) {
    maxUserAmountToBorrow = BigNumber.min(
      maxUserAmountToBorrow,
      valueToBigNumber(poolReserve.formattedAvailableLiquidity).multipliedBy(0.25)
    );
  }
  const shouldAddMargin =
   
    (user.totalBorrowsMarketReferenceCurrency !== "0" && availableForUserUSD.lt(availableInPoolUSD)) ||
    
    (availableForUserUSD.eq(availableInPoolUSD) && poolReserve.totalDebt !== "0") ||
    
    (poolReserve.borrowCapUSD && poolReserve.totalDebt !== "0" && availableForUserUSD.gte(availableInPoolUSD)) ||
    
    (user.isInIsolationMode &&
      user.isolatedReserve?.isolationModeTotalDebt !== "0" &&
     
      valueToBigNumber(user.isolatedReserve?.debtCeiling || "0")
        .minus(user.isolatedReserve?.isolationModeTotalDebt || "0")
        .shiftedBy(-(user.isolatedReserve?.debtCeilingDecimals || 0))
        .multipliedBy("0.99")
        .lt(user.availableBorrowsUSD));
  return shouldAddMargin ? maxUserAmountToBorrow.multipliedBy("0.99") : maxUserAmountToBorrow;
}
getAssetsToSupply(formattedPoolReserves,userSummaryIncentives,market,marketReferenceCurrencyPriceInUsd,walletBalances) {
  
  switch (market) {
    case "mainnet_v3":
      var marketNameAddressBook = 'AaveV3Ethereum';
      var BaseAssetSymbol = 'ETH1';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "polygon_v3":
      var marketNameAddressBook = 'AaveV3Polygon';
      var BaseAssetSymbol = 'MATIC';
      var wrappedBaseAssetSymbol = 'WMATIC';
      break;
    case "fantom_v3":
      var marketNameAddressBook = 'AaveV3Fantom';
      var BaseAssetSymbol = 'FTM';
      var wrappedBaseAssetSymbol = 'WFTM';
      break;
    case "arbitrum_v3":
      var marketNameAddressBook = 'AaveV3Arbitrum';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "optimism_v3":
      var marketNameAddressBook = 'AaveV3Optimism';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "avalanche_v3":
      var marketNameAddressBook = 'AaveV3Avalanche';
      var BaseAssetSymbol = 'AVAX';
      var wrappedBaseAssetSymbol = 'WAVAX';
      break;
    case "harmony_v3":
      var marketNameAddressBook = 'AaveV3Harmony';
      var BaseAssetSymbol = 'ONE';
      var wrappedBaseAssetSymbol = 'WONE';
      break;
      case "metis_v3":
        var marketNameAddressBook = 'AaveV3Metis';
        var BaseAssetSymbol = '';
        var wrappedBaseAssetSymbol = '';
        break;
    default:
      var marketNameAddressBook = 'AaveV3Ethereum';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
  }

  const tokensToSupply = formattedPoolReserves
    .filter((reserve) => !reserve.isFrozen)
    .map((reserve) => {
      const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
      const walletBalanceUSD = walletBalances[reserve.underlyingAsset]?.amountUSD;
      let availableToDeposit = valueToBigNumber(walletBalance);
      if (reserve.supplyCap !== "0") {
        availableToDeposit = BigNumber.min(availableToDeposit, new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy("0.995"));
      }
      const availableToDepositUSD = valueToBigNumber(availableToDeposit).multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(marketReferenceCurrencyPriceInUsd).shiftedBy(-USD_DECIMALS).toString();
      const isIsolated = reserve.isIsolated;
      const hasDifferentCollateral = userSummaryIncentives?.userReservesData.find((userRes) => userRes.usageAsCollateralEnabledOnUser && userRes.reserve.id !== reserve.id);
      const usageAsCollateralEnabledOnUser = !userSummaryIncentives?.isInIsolationMode ? reserve.usageAsCollateralEnabled && (!isIsolated || (isIsolated && !hasDifferentCollateral)) : !isIsolated ? false : !hasDifferentCollateral;
      if (reserve.isWrappedBaseAsset) {
        let baseAvailableToDeposit = valueToBigNumber(walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount);
        if (reserve.supplyCap !== "0") {
          baseAvailableToDeposit = BigNumber.min(baseAvailableToDeposit, new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy("0.995"));
        }
        const baseAvailableToDepositUSD = valueToBigNumber(baseAvailableToDeposit).multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(marketReferenceCurrencyPriceInUsd).shiftedBy(-USD_DECIMALS).toString();
        return [
          {
            ...reserve,
            reserve,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            ...fetchIconSymbolAndName({
              symbol: BaseAssetSymbol,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            }),
            walletBalance: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
            walletBalanceUSD: walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
            availableToDeposit: baseAvailableToDeposit.toString(),
            availableToDepositUSD: baseAvailableToDepositUSD,
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
            id: reserve.id + "base",
          },
          {
            ...reserve,
            reserve,
            walletBalance,
            walletBalanceUSD,
            availableToDeposit: availableToDeposit.toNumber() <= 0 ? "0" : availableToDeposit.toString(),
            availableToDepositUSD: Number(availableToDepositUSD) <= 0 ? "0" : availableToDepositUSD.toString(),
            usageAsCollateralEnabledOnUser,
            detailsAddress: reserve.underlyingAsset,
          },
        ];
      }
      return {
        ...reserve,
        reserve,
        walletBalance,
        walletBalanceUSD,
        availableToDeposit: availableToDeposit.toNumber() <= 0 ? "0" : availableToDeposit.toString(),
        availableToDepositUSD: Number(availableToDepositUSD) <= 0 ? "0" : availableToDepositUSD.toString(),
        usageAsCollateralEnabledOnUser,
        detailsAddress: reserve.underlyingAsset,
      };
    })
    .flat()
    .sort((a, b) => (+a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1))
    
    .filter((reserve) => reserve.availableToDepositUSD !== "NaN");
  return tokensToSupply;
}
getAssetsToBorrow(formattedPoolReserves,userSummaryIncentives,market,marketReferenceCurrencyPriceInUsd) {

  switch (market) {
    case "mainnet_v3":
      var marketNameAddressBook = 'AaveV3Ethereum';
      var BaseAssetSymbol = 'ETH2';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "polygon_v3":
      var marketNameAddressBook = 'AaveV3Polygon';
      var BaseAssetSymbol = 'MATIC';
      var wrappedBaseAssetSymbol = 'WMATIC';
      break;
    case "fantom_v3":
      var marketNameAddressBook = 'AaveV3Fantom';
      var BaseAssetSymbol = 'FTM';
      var wrappedBaseAssetSymbol = 'WFTM';
      break;
    case "arbitrum_v3":
      var marketNameAddressBook = 'AaveV3Arbitrum';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "optimism_v3":
      var marketNameAddressBook = 'AaveV3Optimism';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
    case "avalanche_v3":
      var marketNameAddressBook = 'AaveV3Avalanche';
      var BaseAssetSymbol = 'AVAX';
      var wrappedBaseAssetSymbol = 'WAVAX';
      break;
    case "harmony_v3":
      var marketNameAddressBook = 'AaveV3Harmony';
      var BaseAssetSymbol = 'ONE';
      var wrappedBaseAssetSymbol = 'WONE';
      break;
    default:
      var marketNameAddressBook = 'AaveV3Ethereum';
      var BaseAssetSymbol = 'ETH';
      var wrappedBaseAssetSymbol = 'WETH';
      break;
  }
  const tokensToBorrow = formattedPoolReserves
    .filter((reserve) => this.assetCanBeBorrowedByUser(reserve, userSummaryIncentives))
    .map((reserve) => {
      const availableBorrows = userSummaryIncentives ? this.getMaxAmountAvailableToBorrow(reserve, userSummaryIncentives, this.InterestRate.Variable).toNumber() : 0;
      const availableBorrowsInUSD = valueToBigNumber(availableBorrows).multipliedBy(reserve.formattedPriceInMarketReferenceCurrency).multipliedBy(marketReferenceCurrencyPriceInUsd).shiftedBy(-USD_DECIMALS).toFixed(2);
      return {
        ...reserve,
        reserve,
        totalBorrows: reserve.totalDebt,
        availableBorrows,
        availableBorrowsInUSD,
        stableBorrowRate: reserve.stableBorrowRateEnabled && reserve.borrowingEnabled ? Number(reserve.stableBorrowAPY) : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowAPY) : -1,
        iconSymbol: reserve.iconSymbol,
        ...(reserve.isWrappedBaseAsset
          ? fetchIconSymbolAndName({
              symbol: BaseAssetSymbol,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            })
          : {}),
      };
    });
  const maxBorrowAmount = valueToBigNumber(userSummaryIncentives?.totalBorrowsMarketReferenceCurrency || "0").plus(userSummaryIncentives?.availableBorrowsMarketReferenceCurrency || "0");
  const collateralUsagePercent = maxBorrowAmount.eq(0)
    ? "0"
    : valueToBigNumber(userSummaryIncentives?.totalBorrowsMarketReferenceCurrency || "0")
        .div(maxBorrowAmount)
        .toFixed();
  const borrowReserves = userSummaryIncentives?.totalCollateralMarketReferenceCurrency === "0" || +collateralUsagePercent >= 0.98 ? tokensToBorrow : tokensToBorrow.filter(({ availableBorrowsInUSD, totalLiquidityUSD }) => availableBorrowsInUSD !== "0.00" && totalLiquidityUSD !== "0");
  return borrowReserves;
}
}
export default AaveOffline;