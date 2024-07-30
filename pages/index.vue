<template>
  <v-container class="h-full">
    <v-btn v-for="(timeframe, index) in timeframeActive" :key="index" :loading="timeframe.loading"
      @click="checkTrends(timeframe.timeframe, skip)">{{ timeframe.timeframe
      }}</v-btn>
    <v-btn @click="clearTrends">Clear</v-btn>
    <v-switch
      v-model="skip"
      :label="`Skip`"
    ></v-switch>
    <v-select v-model="minSignals" label="Min" :items="[1, 2, 3, 4, 5, 6]"></v-select>
    <v-table v-if="false" density="compact">
      <thead>
        <tr>
          <th class="text-left">Symbol</th>
          <th class="text-left">Start Time</th>
          <th class="text-left">Countdown</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(trend, index) in trends" :key="index">
          <td>{{ trend.symbol }}</td>
          <td>{{ trend.timeframe }}</td>
          <td>{{ formatTimestamp(trend.lastCandel[0]) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-row>
      <v-col v-for="(signal, i) in signals" :key="i" cols="12" md="4" sm="6">
        <SignalCard :info="signal" />
      </v-col>
    </v-row>
    <strong v-if="!signals.length">No signal found</strong>
  </v-container>
</template>

<script setup>
const {
  timetable,
  timeframeActive
} = useTimeframes()
const { checkTrends, trends, clearTrends } = useTrend()

const minSignals = ref(3)
const skip = ref(true)

const signals = computed(() =>
  Object.values(trends.value)
    .filter((trend) => Math.abs(trend.signalTotal) >= minSignals.value)
    .sort((a, b) => {
      if (Math.abs(a.signalTotal) === Math.abs(b.signalTotal)) {
        return b.lastTime - a.lastTime;
      }
      return Math.abs(a.signalTotal) - Math.abs(b.signalTotal);
    })
)


function checkTimeAndRunScript() {
  const now = new Date();
  const minutes = now.getMinutes();

  if (minutes % 15 === 0) {
    checkTrends("15m", true);
  }
  if (minutes % 30 === 0) {
    checkTrends("30m", true);
  }
  if (minutes % 60 === 0) {
    checkTrends("1h", true);
  }
}


const formatCountdown = (countdown) => {
  const minutes = Math.floor((countdown / (1000 * 60)) % 60);
  const seconds = Math.floor((countdown / 1000) % 60);
  return `${minutes}m ${seconds}s`;
};
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Update countdowns every second
const updateCountdowns = () => {
  const now = new Date().getTime();
  timetable.value = timetable.value.map(time => {
    const newCountdown = new Date(time.start).getTime() - now;
    if (newCountdown <= 0) {
      //onCountdownEnd(time);
    }
    return {
      ...time,
      countdown: newCountdown
    };
  });
};

// Function to run when countdown reaches 0
const onCountdownEnd = (time) => {
  console.log(`Countdown reached 0 for ${time.label} at ${time.start}`);
  // Add your function logic here
  try {
    //checkTrends(time.label)
  } catch (error) {
    console.log(error)
  }
};
let intervalId;

onMounted(() => {
  // createTimetable(); // Create the timetable when the component mounts
  intervalId = setInterval(updateCountdowns, 1000); // Update countdowns every second

  // Initial check
  checkTimeAndRunScript();

  // Check every minute
  setInterval(checkTimeAndRunScript, 60000);
});

onUnmounted(() => {
  clearInterval(intervalId); // Clear the interval when the component is unmounted
});
</script>

<style></style>