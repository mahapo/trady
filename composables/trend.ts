import * as Indicators from '@/technical-analysis/indicators'
import { useLocalStorage } from '@vueuse/core'
// import { useNotifier } from "vuetify-notifier";

export const useTrend = () => {
  const trends = useLocalStorage('trends', {})
  let binance

  const clearTrends = () => {
    trends.value = []
  }

  const checkTrends = async (timeframe: string, skip = false) => {
    // const notifier = useNotifier();
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
      await binance.loadMarketsHelper()
      const markets = await binance.loadMarkets()
      for (const market of Object.values(markets)) {
        await checkTrend(timeframe, market, skip)
      }
      // notifier.toast({text: timeframe + " - " + Object.values(markets).length + "Markets checked", status: "success" });
    } catch (error) {
      console.log(error.message)
    } finally {
      timeframeActive.value[timeframe].loading = false
      timeframeActive.value[timeframe].lastChecked = +new Date()
    }
  }

  const checkTrend = async (timeframe: string, market: object, skip = false) => {
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
  return {
    clearTrends,
    checkTrends,
    checkTrend,
    trends
  }
}
