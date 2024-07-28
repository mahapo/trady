import { intrend } from '@/technical-analysis/strategies'

export const useTrend = () => {
  const trends = ref([])

  const checkTrend = async (timeframe: string) => {
    const ccxt = await import('ccxt')
    const binance = new ccxt.binanceusdm({
      options: { defaultType: 'future', adjustForTimeDifference: true },
      enableRateLimit: true
    })
    await binance.loadMarketsHelper()
    const markets = await binance.loadMarkets()
    console.log(markets);

    for (const market of Object.values(markets).slice(0,10)) {
      const candels = await binance.fetchOHLCV(market.symbol, timeframe, undefined, 50)
      console.log(candels)
      //candels.pop()
      const trend = await intrend(candels)
      trends.value.push({
        timeframe,
        ...trend,
        timestamp: Math.round(trend.lastCandel[0]/1000),
        symbol: market.symbol
      })
      const minSignal = 3
      console.log(market, trend)
    }
  }
  return {
    checkTrend,
    trends
  }
}
