import { ethers } from "ethers";
import { UiPoolDataProvider, UiIncentiveDataProvider, ChainId, WalletBalanceProvider, UserReserveDataHumanized, API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import { valueToBigNumber, nativeToUSD, normalize, USD_DECIMALS, formattedPriceInMarketReferenceCurrency, formatReserves, formatUserSummary, formatReservesAndIncentives, formatUserSummaryAndIncentives } from "@aave/math-utils";
import dayjs from "dayjs";
import axios from "axios";
import BigNumber from "bignumber.js";
import { fetchIconSymbolAndName } from "../utils/reserve";
import * as markets from '@bgd-labs/aave-address-book';
class Aave {
  constructor(market, cache = null) {
    this.market = market;
    this.cache = cache;

    this.reserves = (this.cache && this.cache.reserves) ? this.cache.reserves : null;
    this.userReserves = (this.cache && this.cache.userReserves) ? this.cache.userReserves : null;
    this.reservesIncentives = (this.cache && this.cache.reservesIncentives) ? this.cache.reservesIncentives : null;
    this.userReservesIncentives = (this.cache && this.cache.userReservesIncentives) ? this.cache.userReservesIncentives : null;
  
    switch (market) {
      case "mainnet_v3":
        var marketNameAddressBook = 'AaveV3Ethereum';
        var Chain = ChainId.mainnet;
     
        var providerUrl = 'https://mainnet.infura.io/v3/key';
        var BaseAssetSymbol = 'ETH';
        var wrappedBaseAssetSymbol = 'WETH';
        break;
      case "polygon_v3":
        var marketNameAddressBook = 'AaveV3Polygon';
        var Chain = ChainId.polygon;
        var providerUrl = 'https://polygon-mainnet.infura.io/v3/key';
        var BaseAssetSymbol = 'MATIC';
        var wrappedBaseAssetSymbol = 'WMATIC';
        break;
      case "fantom_v3":
        var marketNameAddressBook = 'AaveV3Fantom';
        var Chain = ChainId.fantom;
        var providerUrl = 'https://fantom-mainnet.gateway.pokt.network/v1/lb/key';
        var BaseAssetSymbol = 'FTM';
        var wrappedBaseAssetSymbol = 'WFTM';
        break;
      case "arbitrum_v3":
        var marketNameAddressBook = 'AaveV3Arbitrum';
        var Chain = ChainId.arbitrum_one;
        var providerUrl = 'https://arbitrum-one.gateway.pokt.network/v1/lb/key';
        var BaseAssetSymbol = 'ETH';
        var wrappedBaseAssetSymbol = 'WETH';
        break;
      case "optimism_v3":
        var marketNameAddressBook = 'AaveV3Optimism';
        var Chain = ChainId.optimism;
        var providerUrl = 'https://optimism-mainnet.infura.io/v3/key';
        var BaseAssetSymbol = 'ETH';
        var wrappedBaseAssetSymbol = 'WETH';
        break;
      case "avalanche_v3":
        var marketNameAddressBook = 'AaveV3Avalanche';
        var Chain = ChainId.avalanche;
        var providerUrl = 'https://avalanche-mainnet.infura.io/v3/key';
        var BaseAssetSymbol = 'AVAX';
        var wrappedBaseAssetSymbol = 'WAVAX';
        break;
      case "harmony_v3":
        var marketNameAddressBook = 'AaveV3Harmony';
        var Chain = ChainId.harmony;
        var providerUrl = 'https://harmony-0.gateway.pokt.network/v1/lb/key';
        var BaseAssetSymbol = 'ONE';
        var wrappedBaseAssetSymbol = 'WONE';
        break;
        case "metis_v3":
        var marketNameAddressBook = 'AaveV3Metis';
        var Chain = ChainId.metis_andromeda;
        var providerUrl = 'https://metis-mainnet.gateway.pokt.network/v1/lb/key';
        var BaseAssetSymbol = '';
        var wrappedBaseAssetSymbol = '';
        break;
      default:
        var marketNameAddressBook = 'AaveV3Ethereum';
        var Chain = ChainId.mainnet;
        var providerUrl = 'https://mainnet.infura.io/v3/key';
        var BaseAssetSymbol = 'ETH';
        var wrappedBaseAssetSymbol = 'WETH';
        break;
    }
  this.chainId = Chain;
  this.provider = new ethers.providers.StaticJsonRpcProvider(providerUrl);
  this.wrappedBaseAssetSymbol = wrappedBaseAssetSymbol;
  this.BaseAssetSymbol = BaseAssetSymbol;
  this.addresses = {
  LENDING_POOL_ADDRESS_PROVIDER: markets[marketNameAddressBook].POOL_ADDRESSES_PROVIDER,
  LENDING_POOL: markets[marketNameAddressBook].POOL,
  WETH_GATEWAY: markets[marketNameAddressBook].WETH_GATEWAY,
  REPAY_WITH_COLLATERAL_ADAPTER: markets[marketNameAddressBook].REPAY_WITH_COLLATERAL_ADAPTER,
  SWAP_COLLATERAL_ADAPTER: markets[marketNameAddressBook].SWAP_COLLATERAL_ADAPTER,
  WALLET_BALANCE_PROVIDER: markets[marketNameAddressBook].WALLET_BALANCE_PROVIDER,
  UI_POOL_DATA_PROVIDER: markets[marketNameAddressBook].UI_POOL_DATA_PROVIDER,
  UI_INCENTIVE_DATA_PROVIDER: markets[marketNameAddressBook].UI_INCENTIVE_DATA_PROVIDER,
  COLLECTOR: markets[marketNameAddressBook].COLLECTOR,
    }
    this.poolDataProviderAddress = this.addresses.UI_POOL_DATA_PROVIDER;
    this.incentiveDataProviderAddress = this.addresses.UI_INCENTIVE_DATA_PROVIDER;
    this.lendingPoolAddressProvider = this.addresses.LENDING_POOL_ADDRESS_PROVIDER;
    this.walletBalanceProviderAddress = this.addresses.WALLET_BALANCE_PROVIDER;

this.poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress: this.poolDataProviderAddress,
  provider: this.provider,
  chainId: this.ChainId,
});

this.incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress: this.incentiveDataProviderAddress,
  provider : this.provider,
  chainId: this.ChainId
});


this.walletBalanceProvider = new WalletBalanceProvider({
  walletBalanceProviderAddress: this.walletBalanceProviderAddress,
  provider : this.provider,
});
this.InterestRate = {
  None: "None",
  Stable: "Stable",
  Variable: "Variable",
};
  }
async getReserves() {

  if (this.reserves) {
    return this.reserves;
  } else {
  
    const reserves = await this.poolDataProviderContract.getReservesHumanized({
      lendingPoolAddressProvider: this.lendingPoolAddressProvider,
    });
    this.reserves = reserves;
    return reserves;
  }
}
async getUserReserves(wallet) {
  if (this.userReserves && this.userReserves[wallet]) {
    return this.userReserves[wallet];
  } else {
   
    const userReserves = await this.poolDataProviderContract.getUserReservesHumanized({
      lendingPoolAddressProvider: this.lendingPoolAddressProvider,
      user: wallet,
    });

   
    if (!this.userReserves) {
      this.userReserves = {};
    }


    this.userReserves[wallet] = userReserves;
    return userReserves;
  }
}
async getReservesIncentivesDataHumanized() {
  if (this.reservesIncentives) {
    return this.reservesIncentives;
  } else {
    const reserveIncentives = await this.incentiveDataProviderContract.getReservesIncentivesDataHumanized({
      lendingPoolAddressProvider: this.lendingPoolAddressProvider,
    });
    this.reservesIncentives = reserveIncentives;
    return reserveIncentives;
  }
}

async getUserReservesIncentivesDataHumanized(wallet) {
  if (this.userReservesIncentives && this.userReservesIncentives[wallet]) {
    return this.userReservesIncentives[wallet];
  } else {
    const userReserveIncentives = await this.incentiveDataProviderContract.getUserReservesIncentivesDataHumanized({
      user: wallet,
      lendingPoolAddressProvider: this.lendingPoolAddressProvider,
    });

    if (!this.userReservesIncentives) {
      this.userReservesIncentives = {};
    }

    this.userReservesIncentives[wallet] = userReserveIncentives;
    return userReserveIncentives;
  }
}


async getFormattedPoolReserves(reservesArray, baseCurrencyData) {
  const reserveIncentives = await this.getReservesIncentivesDataHumanized();

  const currentTimestamp = dayjs().unix();
  const formattedPoolReserves = formatReservesAndIncentives({
    reserves: reservesArray,
    currentTimestamp,
    marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
    marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    reserveIncentives: reserveIncentives,
  }).map((r) => ({
    ...r,
    ...fetchIconSymbolAndName(r),
    isEmodeEnabled: r.eModeCategoryId !== 0,
    isWrappedBaseAsset: r.symbol.toLowerCase() === this.wrappedBaseAssetSymbol.toLowerCase(),
  }));
  return formattedPoolReserves;
}
async getUserSummary(wallet) {
  const reserves = await this.getReserves();
  const userReserves = await this.getUserReserves(wallet);
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const userReservesArray = userReserves.userReserves;
  const currentTimestamp = dayjs().unix();
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  const userSummary = formatUserSummary({
    currentTimestamp,
    marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
    userReserves: userReservesArray,
    formattedReserves: formattedPoolReserves,
    userEmodeCategoryId: userReserves.userEmodeCategoryId,
  });
  return userSummary;
}
async generateFormattedPoolReserves(){
  const reserves = await this.getReserves();
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  return { resultFormattedPoolReserves : formattedPoolReserves, resultBaseCurrencyData : baseCurrencyData };
}

async getUserSummaryPositions(positions) {
    
    const reserves = await this.getReserves();
    const reservesArray = reserves.reservesData;
    const baseCurrencyData = reserves.baseCurrencyData;
    const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
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
        userEmodeCategoryId: position.reserve.userEmodeCategoryId, //userReserves.userEmodeCategoryId (old)
      });
    });
  }
  return positions;
}
async getUserSummaryIncentives(wallet) {
  const reserves = await this.getReserves();
  const userReserves = await this.getUserReserves(wallet);
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const userReservesArray = userReserves.userReserves;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);

  const reserveIncentives = await this.getReservesIncentivesDataHumanized();
  
  const userIncentives = await this.getUserReservesIncentivesDataHumanized(wallet);

  const userEmodeCategoryId = userReserves.userEmodeCategoryId || 0;
  const currentTimestamp = dayjs().unix();
  const userSummaryIncentive = formatUserSummaryAndIncentives({
    currentTimestamp,
    marketReferencePriceInUsd: baseCurrencyData.marketReferenceCurrencyPriceInUsd,
    marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
    userReserves: userReservesArray,
    formattedReserves: formattedPoolReserves,
    userEmodeCategoryId: userEmodeCategoryId,
    reserveIncentives,
    userIncentives,
  });
  const user = {
    ...userSummaryIncentive,
    userEmodeCategoryId,
    isInEmode: userEmodeCategoryId !== 0,
  };
  return user;
}
async getWalletbalance(walletAddress) {
  const reserves = await this.getReserves();
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  const { 0: tokenAddresses, 1: balances } = await this.walletBalanceProvider.getUserWalletBalancesForLendingPoolProvider(walletAddress, this.lendingPoolAddressProvider);

  const userWalletBalance = tokenAddresses.map((address, ix) => ({
    id: `${address.toLowerCase()}`,
    address: address.toLowerCase(),
    amount: balances[ix].toString(),
  }));


  let hasEmptyWallet = true;


  
  const aggregatedBalance = userWalletBalance.reduce((acc, reserve) => {
    const poolReserve = formattedPoolReserves.find((poolReserve) => {
      if (reserve.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        return poolReserve.symbol.toLowerCase() === this.wrappedBaseAssetSymbol.toLowerCase();
      }
      return poolReserve.underlyingAsset.toLowerCase() === reserve.address;
    });
  
    if (reserve.amount !== "0") hasEmptyWallet = false;
  
    if (poolReserve) {
      let poolReserveName = poolReserve.name;
      if (reserve.address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
        poolReserveName = this.BaseAssetSymbol;
      }
      acc[reserve.address] = {
        amount: normalize(reserve.amount, poolReserve.decimals),
        name: poolReserveName,
        amountUSD: nativeToUSD({
          amount: new BigNumber(reserve.amount),
          currencyDecimals: poolReserve.decimals,
          priceInMarketReferenceCurrency: poolReserve.priceInMarketReferenceCurrency,
          marketReferenceCurrencyDecimals: baseCurrencyData.marketReferenceCurrencyDecimals,
          normalizedMarketReferencePriceInUsd: normalize(baseCurrencyData.marketReferenceCurrencyPriceInUsd, USD_DECIMALS),
        }),
      };
    }
    return acc;
  }, {});


  return {
    walletBalances: aggregatedBalance,
    hasEmptyWallet,
    loading: !userWalletBalance.length || !reservesArray.length,
  };
}
async getAssetsToSupply(wallet) {
  const reserves = await this.getReserves();
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  const { walletBalances, loading } = await this.getWalletbalance(wallet);


  const user = await this.getUserSummaryIncentives(wallet);
  const tokensToSupply = formattedPoolReserves
    .filter((reserve) => !reserve.isFrozen)
    .map((reserve) => {
      const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
      const walletBalanceUSD = walletBalances[reserve.underlyingAsset]?.amountUSD;
      let availableToDeposit = valueToBigNumber(walletBalance);
      if (reserve.supplyCap !== "0") {
        availableToDeposit = BigNumber.min(availableToDeposit, new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy("0.995"));
      }
      const availableToDepositUSD = valueToBigNumber(availableToDeposit).multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(baseCurrencyData.marketReferenceCurrencyPriceInUsd).shiftedBy(-USD_DECIMALS).toString();
      const isIsolated = reserve.isIsolated;
      const hasDifferentCollateral = user?.userReservesData.find((userRes) => userRes.usageAsCollateralEnabledOnUser && userRes.reserve.id !== reserve.id);
      const usageAsCollateralEnabledOnUser = !user?.isInIsolationMode ? reserve.usageAsCollateralEnabled && (!isIsolated || (isIsolated && !hasDifferentCollateral)) : !isIsolated ? false : !hasDifferentCollateral;
      if (reserve.isWrappedBaseAsset) {
        let baseAvailableToDeposit = valueToBigNumber(walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount);
        if (reserve.supplyCap !== "0") {
          baseAvailableToDeposit = BigNumber.min(baseAvailableToDeposit, new BigNumber(reserve.supplyCap).minus(reserve.totalLiquidity).multipliedBy("0.995"));
        }
        const baseAvailableToDepositUSD = valueToBigNumber(baseAvailableToDeposit).multipliedBy(reserve.priceInMarketReferenceCurrency).multipliedBy(baseCurrencyData.marketReferenceCurrencyPriceInUsd).shiftedBy(-USD_DECIMALS).toString();
        return [
          {
            ...reserve,
            reserve,
            underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            ...fetchIconSymbolAndName({
              symbol: this.BaseAssetSymbol,
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
  return {resultAssetsToSupply : tokensToSupply,resultWalletBalances : walletBalances};
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
    /**
     * When a user has borrows we assume the debt is increasing faster then the supply.
     * That's a simplification that might not be true, but doesn't matter in most cases.
     */
    (user.totalBorrowsMarketReferenceCurrency !== "0" && availableForUserUSD.lt(availableInPoolUSD)) ||
    /**
     * When the user could in theory borrow all, but the debt accrues the available decreases from block to block.
     */
    (availableForUserUSD.eq(availableInPoolUSD) && poolReserve.totalDebt !== "0") ||
    /**
     * When borrow cap could be reached and debt accumulates the debt would be surpassed.
     */
    (poolReserve.borrowCapUSD && poolReserve.totalDebt !== "0" && availableForUserUSD.gte(availableInPoolUSD)) ||
    /**
     * When the user would be able to borrow all the remaining ceiling we need to add a margin as existing debt.
     */
    (user.isInIsolationMode &&
      user.isolatedReserve?.isolationModeTotalDebt !== "0" &&

      valueToBigNumber(user.isolatedReserve?.debtCeiling || "0")
        .minus(user.isolatedReserve?.isolationModeTotalDebt || "0")
        .shiftedBy(-(user.isolatedReserve?.debtCeilingDecimals || 0))
        .multipliedBy("0.99")
        .lt(user.availableBorrowsUSD));
  return shouldAddMargin ? maxUserAmountToBorrow.multipliedBy("0.99") : maxUserAmountToBorrow;
}
async getAssetsToBorrow(wallet) {
  const reserves = await this.getReserves();
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  const user = await this.getUserSummaryIncentives(wallet);
  const tokensToBorrow = formattedPoolReserves
    .filter((reserve) => this.assetCanBeBorrowedByUser(reserve, user))
    .map((reserve) => {
      const availableBorrows = user ? this.getMaxAmountAvailableToBorrow(reserve, user, this.InterestRate.Variable).toNumber() : 0;
      const availableBorrowsInUSD = valueToBigNumber(availableBorrows).multipliedBy(reserve.formattedPriceInMarketReferenceCurrency).multipliedBy(user.marketReferencePriceInUsd).shiftedBy(-USD_DECIMALS).toFixed(2);
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
              symbol: this.BaseAssetSymbol,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
            })
          : {}),
      };
    });
  const maxBorrowAmount = valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || "0").plus(user?.availableBorrowsMarketReferenceCurrency || "0");
  const collateralUsagePercent = maxBorrowAmount.eq(0)
    ? "0"
    : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || "0")
        .div(maxBorrowAmount)
        .toFixed();
  const borrowReserves = user?.totalCollateralMarketReferenceCurrency === "0" || +collateralUsagePercent >= 0.98 ? tokensToBorrow : tokensToBorrow.filter(({ availableBorrowsInUSD, totalLiquidityUSD }) => availableBorrowsInUSD !== "0.00" && totalLiquidityUSD !== "0");
  return borrowReserves;
}
async getUserTransaction(wallet) {

  const data = {
    query: `{
    userTransactions(
      first: 5
      where: { user: "${wallet}" }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      timestamp
      txHash
      action
      ... on Supply {
        amount
        reserve {
          symbol
          decimals
        }
        assetPriceUSD
      }
      ... on RedeemUnderlying {
        amount
        reserve {
          symbol
          decimals
        }
        assetPriceUSD
      }
      ... on Borrow {
        amount
        borrowRateMode
        borrowRate
        stableTokenDebt
        variableTokenDebt
        reserve {
          symbol
          decimals
        }
        assetPriceUSD
      }
      ... on UsageAsCollateral {
        fromState
        toState
        reserve {
          symbol
        }
      }
      ... on Repay {
        amount
        reserve {
          symbol
          decimals
        }
        assetPriceUSD
      }
      ... on SwapBorrowRate {
        borrowRateModeFrom
        borrowRateModeTo
        variableBorrowRate
        stableBorrowRate
        reserve {
          symbol
          decimals
        }
      }
      ... on LiquidationCall {
        collateralAmount
        collateralReserve {
          symbol
          decimals
        }
        principalAmount
        principalReserve {
          symbol
          decimals
        }
        collateralAssetPriceUSD
        borrowAssetPriceUSD
      }
      ... on RebalanceStableBorrowRate {
        borrowRateFrom
        borrowRateTo
      }
    }
  }`,
  };
  const result = await axios.post("https://api.thegraph.com/subgraphs/name/aave/protocol-v3", data);
  return result;
}
async getUserAPY(wallet) {
  const reserves = await this.getReserves();
  const reservesArray = reserves.reservesData;
  const baseCurrencyData = reserves.baseCurrencyData;
  const formattedPoolReserves = await this.getFormattedPoolReserves(reservesArray, baseCurrencyData);
  const user = await this.getUserSummaryIncentives(wallet);
  const proportions = user.userReservesData.reduce(
    (acc, value) => {
      const reserve = formattedPoolReserves.find((r) => r.underlyingAsset === value.reserve.underlyingAsset);
      if (reserve) {
        if (value.underlyingBalanceUSD !== "0") {
          acc.positiveProportion = acc.positiveProportion.plus(new BigNumber(reserve.supplyAPY).multipliedBy(value.underlyingBalanceUSD));
          if (reserve.aIncentivesData) {
            reserve.aIncentivesData.forEach((incentive) => {
              acc.positiveProportion = acc.positiveProportion.plus(new BigNumber(incentive.incentiveAPR).multipliedBy(value.underlyingBalanceUSD));
            });
          }
        }
        if (value.variableBorrowsUSD !== "0") {
          acc.negativeProportion = acc.negativeProportion.plus(new BigNumber(reserve.variableBorrowAPY).multipliedBy(value.variableBorrowsUSD));
          if (reserve.vIncentivesData) {
            reserve.vIncentivesData.forEach((incentive) => {
              acc.positiveProportion = acc.positiveProportion.plus(new BigNumber(incentive.incentiveAPR).multipliedBy(value.variableBorrowsUSD));
            });
          }
        }
        if (value.stableBorrowsUSD !== "0") {
          acc.negativeProportion = acc.negativeProportion.plus(new BigNumber(value.stableBorrowAPY).multipliedBy(value.stableBorrowsUSD));
          if (reserve.sIncentivesData) {
            reserve.sIncentivesData.forEach((incentive) => {
              acc.positiveProportion = acc.positiveProportion.plus(new BigNumber(incentive.incentiveAPR).multipliedBy(value.stableBorrowsUSD));
            });
          }
        }
      } else {
        throw new Error("no possible to calculate net apy");
      }
      return acc;
    },
    {
      positiveProportion: new BigNumber(0),
      negativeProportion: new BigNumber(0),
    }
  );
  const earnedAPY = proportions.positiveProportion.dividedBy(user.totalLiquidityUSD).toNumber();
  const debtAPY = proportions.negativeProportion.dividedBy(user.totalBorrowsUSD).toNumber();
  const netAPY = (earnedAPY || 0) * (Number(user.totalLiquidityUSD) / Number(user.netWorthUSD !== "0" ? user.netWorthUSD : "1")) - (debtAPY || 0) * (Number(user.totalBorrowsUSD) / Number(user.netWorthUSD !== "0" ? user.netWorthUSD : "1"));
  return { earnedAPY, debtAPY, netAPY };
}
}
export default Aave;
