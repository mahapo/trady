import { intrend } from '@/technical-analysis/strategies'

export const useTrend = () => {
  const trends = ref([])
  
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

    for (const market of Object.values(markets).slice(0,10)) {
      const candels = await binance.fetchOHLCV(market.symbol, timeframe, 50)
      candels.pop()
      const trend = await intrend(candels)
      trends.value.push({...trend, symbol: market.symbol})
      const minSignal = 3
      console.log(market, trend)
    }
  }
  return {
    checkTrend,
    trends
  }
}
