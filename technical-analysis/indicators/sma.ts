import { OHLCV } from 'ccxt'
import { SMA } from 'technicalindicators'

export class ISma {
  name = "RSma"
  signal(candels: OHLCV[]){
    const lastPrice = candels[0][4]
    const sma5 = this.check(candels, 5)
    const sma10 = this.check(candels, 10)

    if (sma5 < sma10 && sma10 > lastPrice) {
      return 1
    } else if (sma5 > sma10 && sma10 < lastPrice) {
      return -1
    }
    return 0
  }
  
  check(candels: OHLCV[], period = 20): number {
    const close = candels.map(c => c[4])
  
    const sma = SMA.calculate({
      period,
      values: close
    })
    return sma[sma.length - 1]
  }
}

export function sma(candels: OHLCV[], period = 20): number {
  const close = candels.map(c => c[4])

  const sma = SMA.calculate({
    period,
    values: close
  })
  return sma[sma.length - 1]
}
