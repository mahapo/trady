import { OHLCV } from 'ccxt'
import { RSI } from 'technicalindicators'

export class IRsi {
  name = "RSI"

  static signal(candels: OHLCV[]){
    const rsi14 = IRsi.check(candels)

    if (rsi14 < 30) {
      return 1
    } else if (rsi14 > 70) {
      return -1
    }
    return 0
  }
  
  static check(candels: OHLCV[], period = 14): number {
    const close = candels.map(c => c[4])
    const results = RSI.calculate({ values: close, period })
    return results[results.length - 1]
  }  
}
