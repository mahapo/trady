<template>
  <div>
    <h2>23</h2>
    <v-btn v-for="(timeframe, index) in timeframeActive" :key="index" @click="checkTrend(timeframe)">{{ timeframe }}</v-btn>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Sybol</th>
          <th class="text-left">Start Time</th>
          <th class="text-left">Countdown</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(trend, index) in trends" :key="index">
          <td>{{ trend.symbol }}</td>
          <td>{{ trend.start }}</td>
          <td>{{ formatTimestamp(trend.lastCandel[0]) }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-table density="compact">
      <thead>
        <tr>
          <th class="text-left">Label</th>
          <th class="text-left">Start Time</th>
          <th class="text-left">Countdown</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, index) in timetable" :key="index">
          <td>{{ time.label }}</td>
          <td>{{ time.start }}</td>
          <td>{{ formatCountdown(time.countdown) }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script setup>
const {
  timetable,
  predefinedDurations,
  timeframeActive,
  createTimetable
} = useTimeframes()
const { checkTrend, trends } = useTrend()
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
      onCountdownEnd(time);
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
    //checkTrend(time.label)
  } catch (error) {
    console.log(error)
  }
};
let intervalId;

onMounted(() => {
  createTimetable(); // Create the timetable when the component mounts
  intervalId = setInterval(updateCountdowns, 1000); // Update countdowns every second
});

onUnmounted(() => {
  clearInterval(intervalId); // Clear the interval when the component is unmounted
});
</script>

<style></style>