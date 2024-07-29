import { OHLCV } from 'ccxt';
import { CCI } from 'technicalindicators';

export class ICCI {
  static name = "CCI";
  static cciPeriod: number = 14;  // Default CCI period

  // Static method to generate trading signals based on CCI
  static signal(candles: OHLCV[], cciPeriod: number = ICCI.cciPeriod): number {
    const cciValues = ICCI.calculateCCI(candles, cciPeriod);

    if (cciValues.length < 2) {
      return 0;  // Not enough data to generate a signal
    }

    const lastCci = cciValues[cciValues.length - 1];
    const prevCci = cciValues[cciValues.length - 2];

    let signal = 0;

    if (lastCci > 100 && prevCci <= 100) {
      signal = 1;  // Buy signal
    } else if (lastCci < -100 && prevCci >= -100) {
      signal = -1;  // Sell signal
    }

    return signal;
  }

  // Static method to calculate CCI values
  static calculateCCI(candles: OHLCV[], period: number): number[] {
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);
    const close = candles.map(c => c[4]);
    const cciInput = {
      high,
      low,
      close,
      period
    };
    return CCI.calculate(cciInput);
  }
}