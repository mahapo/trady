import { OHLCV } from 'ccxt';

interface CandlestickPatternResult {
  pattern: string;
  signal: number;
}

export class IPennantFlag {
  static name = "PennantFlag";

  // Static method to generate trading signals based on candlestick patterns
  static signal(candles: OHLCV[]): number {
    const patterns = IPennantFlag.detectPatterns(candles);

    if (patterns.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const latestPattern = patterns[patterns.length - 1];

    // Define signals based on patterns
    if (latestPattern.pattern === "Head and Shoulders Top" || 
        latestPattern.pattern === "Double Top" ||
        latestPattern.pattern === "Rising Wedge" ||
        latestPattern.pattern === "Flag Bearish" ||
        latestPattern.pattern === "Pennant Bearish") {
      return -1;  // Sell signal for bearish patterns
    } else if (latestPattern.pattern === "Head and Shoulders Bottom" || 
               latestPattern.pattern === "Double Bottom" ||
               latestPattern.pattern === "Falling Wedge" ||
               latestPattern.pattern === "Flag Bullish" ||
               latestPattern.pattern === "Pennant Bullish") {
      return 1;  // Buy signal for bullish patterns
    }

    return 0;
  }

  // Static method to detect various candlestick patterns
  static detectPatterns(candles: OHLCV[]): CandlestickPatternResult[] {
    const results: CandlestickPatternResult[] = [];

    // Ensure we have enough data to detect patterns
    if (candles.length < 12) {
      return results;  // Not enough data
    }

    for (let i = 11; i < candles.length; i++) {
      const [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth] = candles.slice(i - 11, i + 1);
      
      // Extract OHLC values for the relevant candles
      const [fOpen, fHigh, fLow, fClose] = first;
      const [sOpen, sHigh, sLow, sClose] = second;
      const [tOpen, tHigh, tLow, tClose] = third;
      const [foOpen, foHigh, foLow, foClose] = fourth;
      const [fiOpen, fiHigh, fiLow, fiClose] = fifth;
      const [siOpen, siHigh, siLow, siClose] = sixth;
      const [seOpen, seHigh, seLow, seClose] = seventh;
      const [eOpen, eHigh, eLow, eClose] = eighth;
      const [nOpen, nHigh, nLow, nClose] = ninth;
      const [teOpen, teHigh, teLow, teClose] = tenth;
      const [elOpen, elHigh, elLow, elClose] = eleventh;
      const [twOpen, twHigh, twLow, twClose] = twelfth;

      // Flag Bullish Pattern Detection
      const isFlagBullish = (
        fHigh < sHigh && sHigh < tHigh &&
        tHigh < foHigh && foHigh < fiHigh &&
        tLow < sLow && sLow < tLow &&
        tLow < foLow && foLow < fiLow &&
        eClose > eOpen && nClose > nOpen
      );

      // Flag Bearish Pattern Detection
      const isFlagBearish = (
        fLow > sLow && sLow > tLow &&
        tLow > foLow && foLow > fiLow &&
        tHigh > sHigh && sHigh > fHigh &&
        fHigh > foHigh && foHigh > fiHigh &&
        eClose < eOpen && nClose < nOpen
      );

      // Pennant Bullish Pattern Detection
      const isPennantBullish = (
        fHigh < sHigh && sHigh < tHigh &&
        tHigh < foHigh && foHigh < fiHigh &&
        fLow < sLow && sLow < tLow &&
        tLow < foLow && foLow < fiLow &&
        (foHigh - fHigh) < (foLow - fLow) &&
        (eClose > eOpen) && (nClose > nOpen)
      );

      // Pennant Bearish Pattern Detection
      const isPennantBearish = (
        fLow > sLow && sLow > tLow &&
        tLow > foLow && foLow > fiLow &&
        fHigh > sHigh && sHigh > tHigh &&
        tHigh > foHigh && foHigh > fiHigh &&
        (fHigh - foHigh) < (sLow - tLow) &&
        (eClose < eOpen) && (nClose < nOpen)
      );

      if (isFlagBullish) {
        results.push({
          pattern: "Flag Bullish",
          signal: 1  // Buy signal
        });
      } else if (isFlagBearish) {
        results.push({
          pattern: "Flag Bearish",
          signal: -1  // Sell signal
        });
      } else if (isPennantBullish) {
        results.push({
          pattern: "Pennant Bullish",
          signal: 1  // Buy signal
        });
      } else if (isPennantBearish) {
        results.push({
          pattern: "Pennant Bearish",
          signal: -1  // Sell signal
        });
      }
    }

    return results;
  }
}
