import { OHLCV } from 'ccxt';

interface CandlestickPatternResult {
  pattern: string;
  signal: number;
}

export class ITriangles {
  static name = "Triangles";

  // Static method to generate trading signals based on candlestick patterns
  static signal(candles: OHLCV[]): number {
    const patterns = ITriangles.detectPatterns(candles);

    if (patterns.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const latestPattern = patterns[patterns.length - 1];

    // Define signals based on patterns
    if (latestPattern.pattern === "Ascending Triangle" ||
        latestPattern.pattern === "Symmetrical Triangle") {
      return 1;  // Buy signal for bullish patterns
    } else if (latestPattern.pattern === "Descending Triangle") {
      return -1;  // Sell signal for bearish patterns
    }

    return 0;
  }

  // Static method to detect various candlestick patterns
  static detectPatterns(candles: OHLCV[]): CandlestickPatternResult[] {
    const results: CandlestickPatternResult[] = [];

    // Ensure we have enough data to detect patterns
    if (candles.length < 10) {
      return results;  // Not enough data
    }

    for (let i = 9; i < candles.length; i++) {
      const [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth] = candles.slice(i - 9, i + 1);

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

      // Ascending Triangle Pattern Detection
      const isAscendingTriangle = (
        fHigh < sHigh && sHigh < tHigh &&
        tHigh < foHigh && foHigh < fiHigh &&
        sLow >= tLow && tLow >= foLow &&
        foLow >= fiLow && fiLow >= siLow &&
        eHigh >= nHigh && eLow >= nLow &&
        nHigh >= teHigh && nLow >= teLow
      );

      // Descending Triangle Pattern Detection
      const isDescendingTriangle = (
        fLow > sLow && sLow > tLow &&
        tLow > foLow && foLow > fiLow &&
        fHigh >= sHigh && sHigh >= tHigh &&
        tHigh >= foHigh && foHigh >= fiHigh &&
        eHigh <= nHigh && eLow <= nLow &&
        nHigh <= teHigh && nLow <= teLow
      );

      // Symmetrical Triangle Pattern Detection
      const isSymmetricalTriangle = (
        fHigh < sHigh && sHigh < tHigh &&
        tHigh < foHigh && foHigh < fiHigh &&
        fLow > sLow && sLow > tLow &&
        tLow > foLow && foLow > fiLow &&
        (eHigh - eLow) < (nHigh - nLow) &&
        (nHigh - nLow) < (teHigh - teLow)
      );

      if (isAscendingTriangle) {
        results.push({
          pattern: "Ascending Triangle",
          signal: 1  // Buy signal
        });
      } else if (isDescendingTriangle) {
        results.push({
          pattern: "Descending Triangle",
          signal: -1  // Sell signal
        });
      } else if (isSymmetricalTriangle) {
        results.push({
          pattern: "Symmetrical Triangle",
          signal: 1  // Buy signal for bullish breakout, could also be -1 for bearish breakout depending on the trend
        });
      }
    }

    return results;
  }
}
