import { OHLCV } from 'ccxt'
import { StochasticRSI } from 'technicalindicators'

export function srsi(candels: OHLCV[], lenght = 1): any[] {
  const close = candels.map(c => c[4])
  const results = StochasticRSI.calculate({
    values: close,
    rsiPeriod: 14,
    stochasticPeriod: 14,
    kPeriod: 3,
    dPeriod: 3
  })

  return [results[results.length - 2], results[results.length - 1]]
}
