import * as Indicators from '@/technical-analysis/indicators'
import { useLocalStorage } from '@vueuse/core'

export const useTrend = () => {
  const trends = useLocalStorage('trends', {})

  const checkTrend = async (timeframe: string, skip = false) => {
    const ccxt = await import('ccxt')
    const binance = new ccxt.binanceusdm({
      options: { defaultType: 'future', adjustForTimeDifference: true },
      enableRateLimit: true
    })
    await binance.loadMarketsHelper()
    const markets = await binance.loadMarkets()
    console.log(markets);

    for (const market of Object.values(markets).slice(0,200)) {
      let id = `${market.id}-${timeframe}`

      const candels = await binance.fetchOHLCV(market.symbol, timeframe, undefined, 50)
      if(skip) candels.pop()
      const lastPrice = candels[candels.length - 1][4]
      const lastTime = candels[candels.length - 1][0]
      trends.value[id] = {
        id: market.id,
        symbol: market.symbol,
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
  }
  return {
    checkTrend,
    trends
  }
}
