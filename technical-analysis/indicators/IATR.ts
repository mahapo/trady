import { OHLCV } from 'ccxt';
import { ATR } from 'technicalindicators';

export class IATR {
  static name = "ATR";

  // Method to generate trading signals based on ATR
  static signal(candles: OHLCV[]): number {
    const atrValues = IATR.calculateATR(candles);

    if (atrValues.length < 2) {
      return 0;  // Not enough data to generate a signal
    }

    const lastAtr = atrValues[atrValues.length - 1];
    const prevAtr = atrValues[atrValues.length - 2];

    let signal = 0;

    if (lastAtr > prevAtr) {
      signal = 1;  // Possible increase in volatility (Buy signal)
    } else if (lastAtr < prevAtr) {
      signal = -1;  // Possible decrease in volatility (Sell signal)
    }

    return signal;
  }

  // Method to calculate ATR values
  static calculateATR(candles: OHLCV[], atrPeriod = 14): number[] {
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);
    const close = candles.map(c => c[4]);
    const atrInput = {
      high,
      low,
      close,
      period: atrPeriod
    };
    return ATR.calculate(atrInput);
  }
}