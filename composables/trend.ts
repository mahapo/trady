import * as Indicators from '@/technical-analysis/indicators'
import { useLocalStorage } from '@vueuse/core'


function splitIntoChunks<T>(array: T[], n: number): T[][] {
  // If the chunk size is less than or equal to 0, return an empty array
  if (n <= 0) return [];

  const chunks: T[][] = [];

  // Loop through the array, slicing it into chunks of size n
  for (let i = 0; i < array.length; i += n) {
    chunks.push(array.slice(i, i + n));
  }

  return chunks;
}

export const useTrend = () => {
  const trends = useLocalStorage('trends', {})
  let binance

  async function fetchAndFilterMarkets(percentThreshold: number = 3) {
    // Load markets and ticker information
    try {
      // Fetch all tickers
      const tickers = await binance.fetchTickers();
  
      // Filter tickers based on percent change
      const filteredMarkets = Object.entries(tickers)
        .filter(([symbol, ticker]) => {
          // Calculate percentage change
          const open = ticker.open;
          const last = ticker.last;
          if(!symbol.includes(':USDT')) {
            return false
          }
          if (open !== undefined && last !== undefined) {
            const percentChange = ((last - open) / open) * 100;
            return Math.abs(percentChange) >= percentThreshold;
          }
          return false;
        })
        .map(([symbol, ticker]) => ({
          ...ticker,
          symbol
        }));
  
      return filteredMarkets;
    } catch (error) {
      console.error('Error fetching tickers:', error);
      return [];
    }
  }

    // Function to fetch OHLCV for a single market
    const fetchMarketData = async (market: object, timeframe: string ) => {
      try {
        const ohlcv = await binance.fetchOHLCV(market.symbol, timeframe, undefined, 50);
        return { market, ohlcv };
      } catch (error) {
        console.error(`Error fetching data for market ${market.symbol}:`, error);
        return { market, ohlcv: [] };
      }
    };
  

  const clearTrends = () => {
    trends.value = []
  }

  const checkTrends = async (timeframe: string, skip = false) => {
    // const notifier = useNotifier();
    const start = new Date().getTime();
    const {
      timeframeActive
    } = useTimeframes()
    console.log(timeframeActive.value, timeframe)
    timeframeActive.value[timeframe].loading = true
    timeframeActive.value[timeframe].lastChecked = +new Date()
    try {
      const ccxt = await import('ccxt')
      binance = new ccxt.binanceusdm({
        options: { defaultType: 'future', adjustForTimeDifference: true },
        enableRateLimit: true
      })


      
      const markets = await fetchAndFilterMarkets(4)
      console.log(markets)
      const promises = markets.map(m=>fetchMarketData(m, timeframe));
      const results = await Promise.all(promises);
      console.log(results)
      for (const result of results) {
        checkTrend(result.ohlcv, result.market, timeframe, skip)
      }
      // notifier.toast({text: timeframe + " - " + Object.values(markets).length + "Markets checked", status: "success" });
    } catch (error) {
      console.log(error.message)
    } finally {
      timeframeActive.value[timeframe].loading = false
      timeframeActive.value[timeframe].lastChecked = +new Date()
      const end = new Date().getTime();
      console.log(`Time taken: ${end - start} ms`);
    }
  }

  const checkTrend = async (candels, market: object, timeframe: string, skip = false) => {
    let id = `${market.id}-${timeframe}-${skip}`

    // const candels = await binance.fetchOHLCV(market.symbol, timeframe, undefined, 50)
    if(skip) candels.pop()
    const lastPrice = candels[candels.length - 1][4]
    const lastTime = candels[candels.length - 1][0]
    trends.value[id] = {
      ... market,
      timeframe,
      lastPrice,
      lastTime,
      indicators: {},
      signalTotal: 0,
      closes: candels.map(c=>c[4])
    }
    
    for (const key in Indicators) {
      const signal = Indicators[key].signal(candels)
      trends.value[id]['indicators'][key] = signal
      trends.value[id]['signalTotal'] += signal
    }
  }
  return {
    clearTrends,
    checkTrends,
    checkTrend,
    trends
  }
}
