import { OHLCV } from 'ccxt'
import { BollingerBands } from 'technicalindicators'
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands'

export function bollingerBands(
  candels: OHLCV[],
  period = 20
): BollingerBandsOutput {
  const close = candels.map(c => c[4])
  const bollingerBands = BollingerBands.calculate({
    values: close,
    period: period,
    stdDev: 2
  })
  return bollingerBands[bollingerBands.length - 1]
}
