
import { valueToBigNumber } from "@aave/math-utils";

import AaveClass from "../../../service/aave";

let cachedData = {};
let cacheExpiration = {};

async function getAaveData(wallet, network, resetCache = false) {
  const now = new Date();
  const cacheKey = `${wallet}-${network}`;

  if (
    cachedData[cacheKey] &&
    cacheExpiration[cacheKey] &&
    now < cacheExpiration[cacheKey] &&
    !resetCache
  ) {
    return cachedData[cacheKey];
  } else {
    try {
      const Aave = new AaveClass(network);

      const startTime = new Date(); 
      const reserves = await Aave.getReserves();
      const userReserves = await Aave.getUserReserves(wallet);
      const getReservesIncentivesDataHumanized = await Aave.getReservesIncentivesDataHumanized();
      const getUserReservesIncentivesDataHumanized = await Aave.getUserReservesIncentivesDataHumanized(wallet);

      const cache = {
        reserves: reserves,
        userReserves: {
          [wallet]: userReserves,
        },
        reservesIncentives: getReservesIncentivesDataHumanized,
        userReservesIncentives: {
          [wallet]: getUserReservesIncentivesDataHumanized,
        },
      };

      const AaveCache = new AaveClass(network, cache);

      const { resultFormattedPoolReserves, resultBaseCurrencyData } = await AaveCache.generateFormattedPoolReserves(wallet.toString());
      const resultSummary = await AaveCache.getUserSummaryIncentives(wallet.toString());
      const maxBorrowAmount = valueToBigNumber(resultSummary?.totalBorrowsMarketReferenceCurrency || "0").plus(resultSummary?.availableBorrowsMarketReferenceCurrency || "0");
      const collateralUsagePercent = maxBorrowAmount.eq(0)
        ? "0"
        : valueToBigNumber(resultSummary?.totalBorrowsMarketReferenceCurrency || "0")
          .div(maxBorrowAmount)
          .toFixed();
      const resultTransactions = null;
      const userTransactions = null;
      const { earnedAPY, debtAPY, netAPY } = await AaveCache.getUserAPY(wallet);
      const apyz = { earnedAPY, debtAPY, netAPY };
      const { resultAssetsToSupply, resultWalletBalances } = await AaveCache.getAssetsToSupply(wallet.toString());
      const resultAssetsToBorrow = await AaveCache.getAssetsToBorrow(wallet.toString());

      const positions = {
        wallet: wallet,
        network,
        walletBalances: resultWalletBalances,
        userSummary: JSON.parse(JSON.stringify(resultSummary)),
        assetsToSupply: resultAssetsToSupply,
        assetsToBorrow: resultAssetsToBorrow,
        userTransactions: null,
        formattedPoolReserves: resultFormattedPoolReserves,
        baseCurrencyData: resultBaseCurrencyData,
      };
      const details = {
        collateralUsagePercent,
        userTransactions: null,
        apyz,
      };

      const endTime1 = new Date(); 
      const elapsedTime1 = endTime1 - startTime; 

     
      cachedData[cacheKey] = {
        positions: positions,
        details: details,
        elapsedTime1: elapsedTime1,
      };


      cacheExpiration[cacheKey] = new Date(now.getTime() + 60 * 1000);

      setTimeout(() => {
        cachedData[cacheKey] = null;
        cacheExpiration[cacheKey] = null;
      }, 60 * 1000);


      return cachedData[cacheKey];
    } catch (error) {
      console.log(error)
    }
  }
}

export default async function handler(req, res) {
  const { path } = req.query;
  const wallet = req.query.all[0];
  const network = req.query.all[1];
  const resetCache = req.query.all[2] === 'reset'; 

  try {
  
    const data = await getAaveData(wallet, network, resetCache);
  
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
