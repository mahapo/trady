import { OHLCV } from 'ccxt'
import { MACD } from 'technicalindicators'
import { MACDOutput } from 'technicalindicators/declarations/moving_averages/MACD'

export class IMacd {
  static name = "Macd"
  static signal(candels: OHLCV[]){
    const macd = IMacd.check(candels)
    if(!macd) return 0
    if (
      macd[macd.length- 1].MACD > macd[macd.length- 1].signal &&
      macd[macd.length- 2].MACD <= macd[macd.length- 2].signal
    ) {
      return 1
    } else if (
      macd[macd.length- 1].MACD < macd[macd.length- 1].signal &&
      macd[macd.length- 2].MACD >= macd[macd.length- 2].signal
    ) {
      return -1
    }
    return 0
  }
  
  static check(candels: OHLCV[], period = 20): MACDOutput[] {
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
    return macd
  }
}