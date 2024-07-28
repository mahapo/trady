import * as Indicators from '../indicators'
export async function intrend(candels) {
  const lastPrice = candels[0][4]
  console.log(Indicators)
  return 
  const indicator = {
    rsi14: rsi(candels, 8),
    // rvoi: rvoi(candels),
    srsi: srsi(candels),
    bollingerBands: bollingerBands(candels),
    macd: macd(candels),
    sma5: sma(candels, 5),
    sma10: sma(candels, 10)
    // srsi: await srsi(candels),
  }

  let signal = 0

  if (
    indicator.srsi[0].k >= 95 &&
    indicator.srsi[0].d >= 95 &&
    indicator.srsi[0].d <= indicator.srsi[0].k &&
    indicator.srsi[1].d > indicator.srsi[1].k
  ) {
    signal--
  } else if (
    indicator.srsi[0].k <= 5 &&
    indicator.srsi[0].d <= 5 &&
    indicator.srsi[0].d >= indicator.srsi[0].k &&
    indicator.srsi[1].d < indicator.srsi[1].k
  ) {
    signal++
  }

  if (indicator.rsi14 < 30) {
    signal++
  } else if (indicator.rsi14 > 70) {
    signal--
  }

  if (lastPrice <= indicator.bollingerBands.lower) {
    signal++
  } else if (lastPrice >= indicator.bollingerBands.upper) {
    signal--
  }

  if (indicator.macd.MACD > indicator.macd.signal) {
    signal++
  } else if (indicator.macd.MACD < indicator.macd.signal) {
    signal--
  }

  if (indicator.sma5 < indicator.sma10 && indicator.sma10 > lastPrice) {
    signal++
  } else if (indicator.sma5 > indicator.sma10 && indicator.sma10 < lastPrice) {
    signal--
  }

  return {
    indicator,
    signal,
    lastPrice,
    lastCandel: candels[candels.length - 1]
  }
}
