// import ccxt from 'ccxt'
import { useLocalStorage } from '@vueuse/core'

export function useTimeframes() {
  const timetable = ref([])
  const predefinedDurations = {
    '1m': 1 * 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '3d': 3 * 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000
  };
  const timeframeActive = useLocalStorage('timeframeActive',{
    "15m": {
      timeframe: '15m',
      lastChecked: 0,
      loading: false
    },
    "30m": {
      timeframe: '30m',
      lastChecked: 0,
      loading: false
    },
    "1h": {
      timeframe: '1h',
      lastChecked: 0,
      loading: false
    },
    "2h": {
      timeframe: '2h',
      lastChecked: 0,
      loading: false
    },
    "4h": {
      timeframe: '4h',
      lastChecked: 0,
      loading: false
    },
    "6h": {
      timeframe: '6h',
      lastChecked: 0,
      loading: false
    },
  })

  // // Fetch timeframes from exchange using ccxt
  // async function fetchTimeframes(exchangeId) {
  //   try {
  //     const exchange = new ccxt[exchangeId]();
  //     await exchange.loadMarkets(); // Load markets and timeframes
  //     return exchange.timeframes;
  //   } catch (error) {
  //     console.error('Failed to fetch timeframes:', error);
  //     return predefinedDurations; // Fallback to predefined durations
  //   }
  // }

/*   function createTimetable(amount = 10) {
    const now = new Date();
    const newTimetable = [];

    for (const timeframe of timeframeActive.value) {
      const duration = predefinedDurations[timeframe];
      let current = new Date(now.getTime() + (duration - (now.getTime() % duration)));

      for (let i = 0; i < amount; i++) {
        const startTime = new Date(current);
        const endTime = new Date(current.getTime() + duration);
        const countdown = startTime.getTime() - now.getTime();

        newTimetable.push({
          label: timeframe,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          countdown
        });

        current = new Date(endTime.getTime());
      }
    }

    // Sort timetable by start time
    newTimetable.sort((a, b) => new Date(a.start) - new Date(b.start));

    timetable.value = newTimetable;
  } */

  return {
    timetable,
    predefinedDurations,
    timeframeActive
  }
}

