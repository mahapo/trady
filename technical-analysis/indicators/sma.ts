import { OHLCV } from 'ccxt'
import { SMA } from 'technicalindicators'

export class ISma {
  static name = "Sma"
  static signal(candels: OHLCV[]){
    const lastPrice = candels[0][4]
    const sma5 = ISma.check(candels, 5)
    const sma10 = ISma.check(candels, 10)

    if (sma5 < sma10 && sma10 > lastPrice) {
      return 1
    } else if (sma5 > sma10 && sma10 < lastPrice) {
      return -1
    }
    return 0
  }
  
  static check(candels: OHLCV[], period = 20): number {
    const close = candels.map(c => c[4])
  
    const sma = SMA.calculate({
      period,
      values: close
    })
    return sma[sma.length - 1]
  }
}

