import { OHLCV } from 'ccxt'
import { MACD } from 'technicalindicators'
import { MACDOutput } from 'technicalindicators/declarations/moving_averages/MACD'

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
