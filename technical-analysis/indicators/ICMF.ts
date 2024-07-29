import { OHLCV } from 'ccxt';
import { CMF } from 'technicalindicators';

export class ICMF {
  static name = "CMF";

  static period: number = 20;  // Default CMF period

  // Static method to generate trading signals based on CMF
  static signal(candles: OHLCV[], period: number = ICMF.period): number {
    const cmfValues = ICMF.calculateCMF(candles, period);

    if (cmfValues.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const lastCmf = cmfValues[cmfValues.length - 1];

    let signal = 0;

    if (lastCmf > 0) {
      signal = 1;  // Buy signal (indicates accumulation of money)
    } else if (lastCmf < 0) {
      signal = -1;  // Sell signal (indicates distribution of money)
    }

    return signal;
  }

  // Static method to calculate CMF values
  static calculateCMF(candles: OHLCV[], period: number): number[] {
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);
    const close = candles.map(c => c[4]);
    const volume = candles.map(c => c[5]);
    const cmfInput = {
      high,
      low,
      close,
      volume,
      period
    };
    return CMF.calculate(cmfInput);
  }
}