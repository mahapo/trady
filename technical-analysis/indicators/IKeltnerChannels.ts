import { OHLCV } from 'ccxt';
import { ATR } from 'technicalindicators';
import { SMA } from 'technicalindicators';

// Define a type for Keltner Channel output
interface KeltnerChannelOutput {
  upper: number;
  middle: number;
  lower: number;
}

export class IKeltnerChannels {
  static name = "KeltnerChannels";

  static period: number = 20;  // Default period for Keltner Channels
  static atrPeriod: number = 14;  // Default ATR period
  static atrMultiplier: number = 1.5;  // Default ATR multiplier

  // Static method to generate trading signals based on Keltner Channels
  static signal(candles: OHLCV[], period: number = IKeltnerChannels.period, atrPeriod: number = IKeltnerChannels.atrPeriod, atrMultiplier: number = IKeltnerChannels.atrMultiplier): number {
    const keltnerChannels = IKeltnerChannels.calculateKeltnerChannels(candles, period, atrPeriod, atrMultiplier);

    if (!keltnerChannels) {
      return 0;  // Not enough data to generate a signal
    }

    const lastPrice = candles[0][4];
    const { upper, middle, lower } = keltnerChannels;

    let signal = 0;

    if (lastPrice < lower) {
      signal = 1;  // Buy signal (price below lower channel, indicating potential oversold condition)
    } else if (lastPrice > upper) {
      signal = -1;  // Sell signal (price above upper channel, indicating potential overbought condition)
    }

    return signal;
  }

  // Static method to calculate Keltner Channels values
  static calculateKeltnerChannels(candles: OHLCV[], period: number, atrPeriod: number, atrMultiplier: number): KeltnerChannelOutput | null {
    const close = candles.map(c => c[4]);
    const high = candles.map(c => c[2]);
    const low = candles.map(c => c[3]);

    // Calculate the middle line as a simple moving average (SMA) of the closing prices
    const middle = SMA.calculate({ period, values: close });
    if (middle.length < 1) return null; // Not enough data

    // Calculate the ATR
    const atr = ATR.calculate({
      high,
      low,
      close,
      period: atrPeriod
    });
    if (atr.length < 1) return null; // Not enough data

    // Calculate the Keltner Channel values
    const latestMiddle = middle[middle.length - 1];
    const latestATR = atr[atr.length - 1];

    return {
      upper: latestMiddle + (latestATR * atrMultiplier),
      middle: latestMiddle,
      lower: latestMiddle - (latestATR * atrMultiplier)
    };
  }
}