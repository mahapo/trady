import { OHLCV } from 'ccxt'
import { BollingerBands } from 'technicalindicators'
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands'
import { SMA } from 'technicalindicators'

export class IBollingerBands {
  static name = "BollingerBands"

  static signal(candels: OHLCV[]){
    const lastClose = candels[0][4]
    const volume = candels[0][5]
    const bollingerBands = IBollingerBands.check(candels)
    const trend = IBollingerBands.checkTrend(candels)
    const volumeAverage = IBollingerBands.checkVolumeAverage(candels)

    if (lastClose <= bollingerBands.lower && volume > volumeAverage) {
      return 1
    } else if (lastClose >= bollingerBands.upper && volume > volumeAverage) {
      return -1
    }
    return 0
  }
  
  static check(candels: OHLCV[], period = 20): BollingerBandsOutput {
    const close = candels.map(c => c[4])
    const bollingerBands = BollingerBands.calculate({
      values: close,
      period: period,
      stdDev: 2
    })
    return bollingerBands[bollingerBands.length - 1]
  }

  static checkTrend(candels: OHLCV[], period = 50): string {
    const close = candels.map(c => c[4])
    const sma = SMA.calculate({ period: period, values: close })
    const lastSMA = sma[sma.length - 1]
    const prevSMA = sma[sma.length - 2]

    if (lastSMA > prevSMA) {
      return "uptrend"
    } else if (lastSMA < prevSMA) {
      return "downtrend"
    }
    return "neutral"
  }

  static checkVolumeAverage(candels: OHLCV[], period = 20): number {
    const volume = candels.map(c => c[5])
    const sma = SMA.calculate({ period: period, values: volume })
    return sma[sma.length - 1]
  }
}
