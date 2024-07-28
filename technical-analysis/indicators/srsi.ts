import { OHLCV } from 'ccxt'
import { StochasticRSI } from 'technicalindicators'

export class ISRsi {
  name = "SRsi"

  static signal(candels: OHLCV[]){
    const srsi = ISRsi.check(candels)

    if (
      srsi[0].k >= 95 &&
      srsi[0].d >= 95 &&
      srsi[0].d <= srsi[0].k &&
      srsi[1].d > srsi[1].k
    ) {
      return -1
    } else if (
      srsi[0].k <= 5 &&
      srsi[0].d <= 5 &&
      srsi[0].d >= srsi[0].k &&
      srsi[1].d < srsi[1].k
    ) {
      return 1
    }
    return 0
  }
  
  static check(candels: OHLCV[], lenght = 1): any[] {
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
}
