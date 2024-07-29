import { OHLCV } from 'ccxt';
import { EMA } from 'technicalindicators';

export class IEMA {
  static name = "EMA";

  static period: number = 14;  // Default EMA period

  // Static method to generate trading signals based on EMA
  static signal(candles: OHLCV[], period: number = IEMA.period): number {
    const emaValues = IEMA.calculateEMA(candles, period);

    if (emaValues.length < 2) {
      return 0;  // Not enough data to generate a signal
    }

    const lastEma = emaValues[emaValues.length - 1];
    const prevEma = emaValues[emaValues.length - 2];
    const lastPrice = candles[0][4];  // Current closing price

    let signal = 0;

    if (lastPrice > lastEma && lastPrice > prevEma) {
      signal = 1;  // Buy signal
    } else if (lastPrice < lastEma && lastPrice < prevEma) {
      signal = -1;  // Sell signal
    }

    return signal;
  }

  // Static method to calculate EMA values
  static calculateEMA(candles: OHLCV[], period: number): number[] {
    const close = candles.map(c => c[4]);
    const emaInput = {
      values: close,
      period
    };
    return EMA.calculate(emaInput);
  }
}