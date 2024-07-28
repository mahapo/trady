import { OHLCV } from 'ccxt'
import { MACD } from 'technicalindicators'
import { MACDOutput } from 'technicalindicators/declarations/moving_averages/MACD'

export class IMacd {
  name = "Macd"
  signal(candels: OHLCV[]){
    const macd = this.check(candels)

    if (macd.MACD > macd.signal) {
      return 1
    } else if (macd.MACD < macd.signal) {
      return -1
    }
    return 0
  }
  
  check(candels: OHLCV[], period = 20): MACDOutput {
    const close = candels.map(c => c[4])
    const macdInput = {
      values: close,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }
    const macd = MACD.calculate(macdInput)
    return macd[macd.length - 1]
  }
}

export function macd(candels: OHLCV[], period = 20): MACDOutput {
  const close = candels.map(c => c[4])
  const macdInput = {
    values: close,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  }
  const macd = MACD.calculate(macdInput)
  return macd[macd.length - 1]
}
