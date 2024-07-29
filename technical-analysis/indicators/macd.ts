import { OHLCV } from 'ccxt'
import { MACD } from 'technicalindicators'
import { SMA } from 'technicalindicators'

export class IMacd {
  static name = "Macd"

  static signal(candles: OHLCV[]){
    const macd = IMacd.check(candles)
    if(!macd) return 0
    const trend = IMacd.checkTrend(candles)
    const volume = candles[0][5]
    const volumeAverage = IMacd.checkVolumeAverage(candles)

    if (
      macd[macd.length- 1].MACD > macd[macd.length- 1].signal &&
      macd[macd.length- 2].MACD <= macd[macd.length- 2].signal &&
      volume > volumeAverage
    ) {
      return 1
    } else if (
      macd[macd.length- 1].MACD < macd[macd.length- 1].signal &&
      macd[macd.length- 2].MACD >= macd[macd.length- 2].signal &&
      volume > volumeAverage
    ) {
      return -1
    }
    return 0
  }
  
  static check(candles: OHLCV[], period = 20): MACDOutput[] {
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
    return macd
  }

  static checkTrend(candles: OHLCV[], period = 50): string {
    const close = candles.map(c => c[4])
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

  static checkVolumeAverage(candles: OHLCV[], period = 20): number {
    const volume = candles.map(c => c[5])
    const sma = SMA.calculate({ period: period, values: volume })
    return sma[sma.length - 1]
  }
}
