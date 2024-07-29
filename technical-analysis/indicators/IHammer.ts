import { OHLCV } from 'ccxt';

// Define a type for candlestick pattern result
interface CandlestickPatternResult {
  pattern: string;
  signal: number;
}

export class IHammer {
  static name = "Hammer";

  // Static method to generate trading signals based on candlestick patterns
  static signal(candles: OHLCV[]): number {
    const patterns = IHammer.detectPatterns(candles);

    if (patterns.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const latestPattern = patterns[patterns.length - 1];

    // Define signals based on patterns
    if (latestPattern.pattern === "Bullish Hammer" || latestPattern.pattern === "Bullish Inverted Hammer") {
      return 1;  // Buy signal for bullish patterns
    } else if (latestPattern.pattern === "Bearish Hammer" || latestPattern.pattern === "Bearish Inverted Hammer") {
      return -1;  // Sell signal for bearish patterns
    }

    return 0;
  }

  // Static method to detect various candlestick patterns
  static detectPatterns(candles: OHLCV[]): CandlestickPatternResult[] {
    const results: CandlestickPatternResult[] = [];

    for (let i = 1; i < candles.length; i++) {
      const currentCandle = candles[i];
      const open = currentCandle[1];
      const high = currentCandle[2];
      const low = currentCandle[3];
      const close = currentCandle[4];
      
      // Define the criteria for different patterns
      const bodySize = Math.abs(open - close);
      const candleHeight = high - low;
      const upperShadow = high - Math.max(open, close);
      const lowerShadow = Math.min(open, close) - low;

      let pattern = "";
      if (lowerShadow > 2 * bodySize && upperShadow < bodySize && bodySize < 0.5 * candleHeight) {
        pattern = open > close ? "Bearish Hammer" : "Bullish Hammer";
      } else if (upperShadow > 2 * bodySize && lowerShadow < bodySize && bodySize < 0.5 * candleHeight) {
        pattern = open < close ? "Bullish Inverted Hammer" : "Bearish Inverted Hammer";
      }

      if (pattern) {
        results.push({
          pattern,
          signal: pattern.includes("Bullish") ? 1 : (pattern.includes("Bearish") ? -1 : 0)
        });
      }
    }

    return results;
  }
}
