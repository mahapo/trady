import { intrend } from '@/technical-analysis/strategies'

export const useTrend = () => {
  const checkTrend = async (timeframe) => {
    const ccxt = await import('ccxt')
    console.log(ccxt)
    const binance = new ccxt.binanceusdm({
      options: { defaultType: 'future', adjustForTimeDifference: true },
      enableRateLimit: true
    })
    await binance.loadMarketsHelper()
    const markets = await binance.loadMarkets()
    console.log(markets);

    for (const market of Object.values(markets)) {
      const candels = await binance.fetchOHLCV(market.symbol, timeframe, 50)
      candels.pop()
      const trend = await intrend(candels)
      const minSignal = 3
      console.log(market, trend)
    }
  }
  return {
    checkTrend
  }
}
