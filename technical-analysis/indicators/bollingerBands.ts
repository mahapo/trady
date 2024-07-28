import { OHLCV } from 'ccxt'
import { BollingerBands } from 'technicalindicators'
import { BollingerBandsOutput } from 'technicalindicators/declarations/volatility/BollingerBands'

export class IBollingerBands {
  name = "BollingerBands"
  static signal(candels: OHLCV[]){
    const lastPrice = candels[0][4]
    const bollingerBands = this.static check(candels)

    if (lastPrice <= bollingerBands.lower) {
      return 1
    } else if (lastPrice >= bollingerBands.upper) {
      return -1
    }
    return 0
  }
  
  check(
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
}

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
