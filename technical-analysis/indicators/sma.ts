import { OHLCV } from 'ccxt'
import { SMA } from 'technicalindicators'

export function sma(candels: OHLCV[], period = 20): number {
  const close = candels.map(c => c[4])

  const sma = SMA.calculate({
    period,
    values: close
  })
  return sma[sma.length - 1]
}
