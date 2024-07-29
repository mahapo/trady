import { OHLCV } from 'ccxt'
import { SMA } from 'technicalindicators'

export class ISMA {
  static name = "Sma"

  static signal(candles: OHLCV[]): number {
    const lastPrice = candles[0][4]
    const sma5 = ISma.check(candles, 5)
    const sma10 = ISma.check(candles, 10)
    const sma20 = ISma.check(candles, 20)
    const volume = candles[0][5]
    const volumeAverage = ISma.checkVolumeAverage(candles)

    if (sma5 < sma10 && sma10 < sma20 && lastPrice > sma20 && volume > volumeAverage) {
      return 1
    } else if (sma5 > sma10 && sma10 > sma20 && lastPrice < sma20 && volume > volumeAverage) {
      return -1
    }
    return 0
  }
  
  static check(candles: OHLCV[], period: number): number {
    const close = candles.map(c => c[4])
    const sma = SMA.calculate({ period, values: close })
    return sma[sma.length - 1]
  }

  static checkVolumeAverage(candles: OHLCV[], period = 20): number {
    const volume = candles.map(c => c[5])
    const sma = SMA.calculate({ period, values: volume })
    return sma[sma.length - 1]
  }
}
