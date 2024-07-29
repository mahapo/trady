import { OHLCV } from 'ccxt';
import { WilliamsR } from 'technicalindicators';

export class IWilliamsR {
  static name = "WilliamsR";

  static period: number = 14;  // Default period for Williams %R calculation

  // Static method to generate trading signals based on Williams %R
  static signal(candles: OHLCV[], period: number = IWilliamsR.period): number {
    const williamsRValues = IWilliamsR.calculateWilliamsR(candles, period);

    if (williamsRValues.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const lastWilliamsR = williamsRValues[williamsRValues.length - 1];

    let signal = 0;

    if (lastWilliamsR <= -80) {
      signal = 1;  // Buy signal (oversold condition, potential for upward movement)
    } else if (lastWilliamsR >= -20) {
      signal = -1;  // Sell signal (overbought condition, potential for downward movement)
    }

    return signal;
  }

  // Static method to calculate Williams %R values
  static calculateWilliamsR(candles: OHLCV[], period: number): number[] {
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);
    const close = candles.map(c => c[4]);
    const williamsRInput = {
      high,
      low,
      close,
      period
    };
    return WilliamsR.calculate(williamsRInput);
  }
}