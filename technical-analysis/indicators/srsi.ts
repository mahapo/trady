import { OHLCV } from 'ccxt'
import { StochasticRSI, SMA } from 'technicalindicators'

export class IStochasticRSI {
  static name = "SRsi"

  static signal(candles: OHLCV[]): number {
    const srsi = IStochasticRSI.check(candles)
    const volume = candles[0][5]
    const volumeAverage = IStochasticRSI.checkVolumeAverage(candles)
    const sma50 = IStochasticRSI.checkSMA(candles, 50)
    const lastPrice = candles[0][4]
    const divergence = IStochasticRSI.checkDivergence(candles)

    if (
      srsi[0].k >= 95 &&
      srsi[0].d >= 95 &&
      srsi[0].d <= srsi[0].k &&
      srsi[1].d > srsi[1].k &&
      volume > volumeAverage &&
      lastPrice < sma50 &&
      divergence === "bearish"
    ) {
      return -1
    } else if (
      srsi[0].k <= 5 &&
      srsi[0].d <= 5 &&
      srsi[0].d >= srsi[0].k &&
      srsi[1].d < srsi[1].k &&
      volume > volumeAverage &&
      lastPrice > sma50 &&
      divergence === "bullish"
    ) {
      return 1
    }
    return 0
  }
  
  static check(candles: OHLCV[], length = 1): any[] {
    const close = candles.map(c => c[4])
    const results = StochasticRSI.calculate({
      values: close,
      rsiPeriod: 14,
      stochasticPeriod: 14,
      kPeriod: 3,
      dPeriod: 3
    })
    return [results[results.length - 2], results[results.length - 1]]
  }

  static checkVolumeAverage(candles: OHLCV[], period = 20): number {
    const volume = candles.map(c => c[5])
    const sma = SMA.calculate({ period, values: volume })
    return sma[sma.length - 1]
  }

  static checkSMA(candles: OHLCV[], period = 50): number {
    const close = candles.map(c => c[4])
    const sma = SMA.calculate({ period, values: close })
    return sma[sma.length - 1]
  }

  static checkDivergence(candles: OHLCV[]): string {
    const close = candles.map(c => c[4])
    const srsi = StochasticRSI.calculate({
      values: close,
      rsiPeriod: 14,
      stochasticPeriod: 14,
      kPeriod: 3,
      dPeriod: 3
    })
    const lastClose = close[close.length - 1]
    const prevClose = close[close.length - 2]
    const lastK = srsi[srsi.length - 1].k
    const prevK = srsi[srsi.length - 2].k

    if (lastClose < prevClose && lastK > prevK) {
      return "bullish"
    } else if (lastClose > prevClose && lastK < prevK) {
      return "bearish"
    }
    return "neutral"
  }
}
