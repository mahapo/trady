import { OHLCV } from 'ccxt'
import { RSI } from 'technicalindicators'

export function rsi(candels: OHLCV[], period = 14): number {
  const close = candels.map(c => c[4])
  const results = RSI.calculate({ values: close, period })
  return results[results.length - 1]
}
