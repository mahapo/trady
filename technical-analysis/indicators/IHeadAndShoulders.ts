import { OHLCV } from 'ccxt';

interface HeadAndShouldersPatternResult {
  pattern: string;
  signal: number;
}

export class IHeadAndShoulders {
  static name = "HeadAndShoulders";

  // Static method to generate trading signals based on Head and Shoulders patterns
  static signal(candles: OHLCV[]): number {
    const patterns = IHeadAndShoulders.detectPatterns(candles);

    if (patterns.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const latestPattern = patterns[patterns.length - 1];

    // Define signals based on patterns
    if (latestPattern.pattern === "Head and Shoulders Top") {
      return -1;  // Sell signal for bearish pattern
    } else if (latestPattern.pattern === "Head and Shoulders Bottom") {
      return 1;  // Buy signal for bullish pattern
    }

    return 0;
  }

  // Static method to detect Head and Shoulders patterns
  static detectPatterns(candles: OHLCV[]): HeadAndShouldersPatternResult[] {
    const results: HeadAndShouldersPatternResult[] = [];
    
    // Ensure we have enough data to detect the pattern
    if (candles.length < 7) {
      return results;  // Not enough data
    }

    for (let i = 6; i < candles.length; i++) {
      const [first, second, third, fourth, fifth, sixth, seventh] = candles.slice(i - 6, i + 1);
      
      // Extract OHLC values for the relevant candles
      const [fOpen, fHigh, fLow, fClose] = first;
      const [sOpen, sHigh, sLow, sClose] = second;
      const [tOpen, tHigh, tLow, tClose] = third;
      const [foOpen, foHigh, foLow, foClose] = fourth;
      const [fiOpen, fiHigh, fiLow, fiClose] = fifth;
      const [siOpen, siHigh, siLow, siClose] = sixth;
      const [seOpen, seHigh, seLow, seClose] = seventh;

      // Head and Shoulders Top Pattern Detection
      const isHeadAndShouldersTop = (
        tHigh > sHigh && tHigh > fHigh &&
        tHigh > foHigh && tHigh > fiHigh &&
        tHigh > siHigh && tHigh > seHigh &&
        fHigh < sHigh && sHigh < foHigh &&
        foHigh < fiHigh && fiHigh > siHigh &&
        siHigh < seHigh
      );

      // Head and Shoulders Bottom Pattern Detection
      const isHeadAndShouldersBottom = (
        tLow < sLow && tLow < fLow &&
        tLow < foLow && tLow < fiLow &&
        tLow < siLow && tLow < seLow &&
        fLow > sLow && sLow > foLow &&
        foLow > fiLow && fiLow < siLow &&
        siLow > seLow
      );

      if (isHeadAndShouldersTop) {
        results.push({
          pattern: "Head and Shoulders Top",
          signal: -1  // Sell signal
        });
      } else if (isHeadAndShouldersBottom) {
        results.push({
          pattern: "Head and Shoulders Bottom",
          signal: 1  // Buy signal
        });
      }
    }

    return results;
  }
}