import { OHLCV } from 'ccxt';
import { ADX } from 'technicalindicators';

export class IADX {
  static name = "ADX";

  static period: number = 14;  // Default ADX period

  // Static method to generate trading signals based on ADX
  static signal(candles: OHLCV[], period: number = IADX.period): number {
    const adxValues = IADX.calculateADX(candles, period);

    if (adxValues.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const lastAdx = adxValues[adxValues.length - 1].adx;
    const lastPlusDI = adxValues[adxValues.length - 1].plusDI;
    const lastMinusDI = adxValues[adxValues.length - 1].minusDI;

    let signal = 0;

    if (lastAdx > 20) {  // Common threshold for a strong trend
      if (lastPlusDI > lastMinusDI) {
        signal = 1;  // Buy signal (bullish trend)
      } else if (lastPlusDI < lastMinusDI) {
        signal = -1;  // Sell signal (bearish trend)
      }
    }

    return signal;
  }

  // Static method to calculate ADX values
  static calculateADX(candles: OHLCV[], period: number): any[] {
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);
    const close = candles.map(c => c[4]);
    const adxInput = {
      high,
      low,
      close,
      period
    };
    return ADX.calculate(adxInput);
  }
}