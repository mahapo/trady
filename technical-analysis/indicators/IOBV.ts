import { OHLCV } from 'ccxt';
import { OBV } from 'technicalindicators';

export class IOBV {
  static name = "OBV";

  static period: number = 20;  // Default period for analysis (though OBV itself is not period-based, it's useful for comparison)

  // Static method to generate trading signals based on OBV
  static signal(candles: OHLCV[]): number {
    const obvValues = IOBV.calculateOBV(candles);

    if (obvValues.length < 2) {
      return 0;  // Not enough data to generate a signal
    }

    const currentOBV = obvValues[obvValues.length - 1];
    const previousOBV = obvValues[obvValues.length - 2];

    let signal = 0;

    if (currentOBV > previousOBV) {
      signal = 1;  // Buy signal (bullish trend)
    } else if (currentOBV < previousOBV) {
      signal = -1;  // Sell signal (bearish trend)
    }

    return signal;
  }

  // Static method to calculate OBV values
  static calculateOBV(candles: OHLCV[]): number[] {
    const close = candles.map(c => c[4]);
    const volume = candles.map(c => c[5]);
    const obvInput = {
      close,
      volume
    };
    return OBV.calculate(obvInput);
  }
}
