import { OHLCV } from 'ccxt';

interface CandlestickPatternResult {
  pattern: string;
  signal: number;
}

export class IWedges {
  static name = "Wedges";

  // Static method to generate trading signals based on candlestick patterns
  static signal(candles: OHLCV[]): number {
    const patterns = IWedges.detectPatterns(candles);

    if (patterns.length < 1) {
      return 0;  // Not enough data to generate a signal
    }

    const latestPattern = patterns[patterns.length - 1];

    // Define signals based on patterns
    if (latestPattern.pattern === "Head and Shoulders Top" || 
        latestPattern.pattern === "Double Top" ||
        latestPattern.pattern === "Rising Wedge") {
      return -1;  // Sell signal for bearish patterns
    } else if (latestPattern.pattern === "Head and Shoulders Bottom" || 
               latestPattern.pattern === "Double Bottom" ||
               latestPattern.pattern === "Falling Wedge") {
      return 1;  // Buy signal for bullish patterns
    }

    return 0;
  }

  // Static method to detect various candlestick patterns
  static detectPatterns(candles: OHLCV[]): CandlestickPatternResult[] {
    const results: CandlestickPatternResult[] = [];

    // Ensure we have enough data to detect patterns
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

      // Double Top Pattern Detection
      const isDoubleTop = (
        sHigh < fHigh && tHigh < sHigh &&
        fHigh > tHigh && sHigh > tHigh &&
        sHigh < fHigh
      );

      // Double Bottom Pattern Detection
      const isDoubleBottom = (
        sLow > fLow && tLow > sLow &&
        fLow < tLow && sLow < tLow &&
        sLow > fLow
      );

      // Rising Wedge Pattern Detection
      const isRisingWedge = (
        tHigh > sHigh && tHigh > fHigh &&
        sHigh > fHigh && fHigh > foHigh &&
        tLow > sLow && sLow > fLow &&
        fLow > foLow && foLow > fiLow &&
        sHigh - fHigh > sLow - fLow
      );

      // Falling Wedge Pattern Detection
      const isFallingWedge = (
        tLow < sLow && tLow < fLow &&
        sLow < fLow && fLow < foLow &&
        tHigh < sHigh && sHigh < fHigh &&
        fHigh < foHigh && foHigh < fiHigh &&
        fHigh - sHigh < fLow - sLow
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
      } else if (isDoubleTop) {
        results.push({
          pattern: "Double Top",
          signal: -1  // Sell signal
        });
      } else if (isDoubleBottom) {
        results.push({
          pattern: "Double Bottom",
          signal: 1  // Buy signal
        });
      } else if (isRisingWedge) {
        results.push({
          pattern: "Rising Wedge",
          signal: -1  // Sell signal
        });
      } else if (isFallingWedge) {
        results.push({
          pattern: "Falling Wedge",
          signal: 1  // Buy signal
        });
      }
    }

    return results;
  }
}
