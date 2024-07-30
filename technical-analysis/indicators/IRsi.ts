import { OHLCV } from 'ccxt'
import { RSI, MACD, SMA } from 'technicalindicators'

export class IRsi {
  static name = "RSI"

  static signal(candles: OHLCV[]){
    const rsi14 = IRsi.checkRsi(candles)
    const volume = candles[0][5]
    const volumeAverage = IRsi.checkVolumeAverage(candles)
    const macd = IRsi.checkMacd(candles)
    const divergence = IRsi.checkDivergence(candles)

    // if (rsi14 < 30 && volume > volumeAverage && macd === "bullish" && divergence === "bullish") {
    //   return 1
    // } else if (rsi14 > 70 && volume > volumeAverage && macd === "bearish" && divergence === "bearish") {
    //   return -1
    // }
    if (rsi14 < 30 && divergence === "bullish") {
      return 1
    } else if (rsi14 > 70 && divergence === "bearish") {
      return -1
    }
    return 0
  }
  
  static checkRsi(candles: OHLCV[], period = 14): number {
    const close = candles.map(c => c[4])
    const results = RSI.calculate({ values: close, period })
    return results[results.length - 1]
  }

  static checkVolumeAverage(candles: OHLCV[], period = 20): number {
    const volume = candles.map(c => c[5])
    const sma = SMA.calculate({ period: period, values: volume })
    return sma[sma.length - 1]
  }

  static checkMacd(candles: OHLCV[]): string {
    const close = candles.map(c => c[4])
    const macdInput = {
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }
    const macd = MACD.calculate(macdInput)
    const lastMacd = macd[macd.length - 1]
    const prevMacd = macd[macd.length - 2]

    if (lastMacd.MACD > lastMacd.signal && prevMacd.MACD <= prevMacd.signal) {
      return "bullish"
    } else if (lastMacd.MACD < lastMacd.signal && prevMacd.MACD >= prevMacd.signal) {
      return "bearish"
    }
    return "neutral"
  }

  static checkDivergence(candles: OHLCV[]): string {
    const close = candles.map(c => c[4])
    const rsi14 = RSI.calculate({ values: close, period: 14 })
    const lastClose = close[close.length - 1]
    const prevClose = close[close.length - 2]
    const lastRsi = rsi14[rsi14.length - 1]
    const prevRsi = rsi14[rsi14.length - 2]

    if (lastClose < prevClose && lastRsi > prevRsi) {
      return "bullish"
    } else if (lastClose > prevClose && lastRsi < prevRsi) {
      return "bearish"
    }
    return "neutral"
  }
}
