<template>
  <v-card :color="color" variant="outlined" class="mx-auto" :min-height="200">
    <v-card-item>
      <div>
        <v-card-title class="text-h6 mb-1">
          {{ info.timeframe }} - {{ info.symbol.replace(':USDT', '') }} ({{ info.signalTotal }})
        </v-card-title>
        <v-card-subtitle>
          {{ info.lastPrice }} <small>({{ formatTimestamp(info.lastTime) }})</small>
        </v-card-subtitle>
        <v-list :lines="false" density="compact" bg-color="rgba(255, 0, 0, 0)">
          <v-list-item v-for="(signal, indicator) in indicators" class="pa-0">{{indicator}} {{ signal > 0 ? 'buy' : 'sell' }}</v-list-item>
        </v-list>
      </div>
    </v-card-item>

    <v-sparkline
      style="z-index: -1"
      class="position-absolute top-0 bottom-0 left-0 right-0 opacity-30"
      position="absolute"
      :model-value="info.closes"
      height="150"
      padding="0"
      stroke-linecap="round"
      smooth
      auto-draw
    >
    </v-sparkline>

    <v-card-actions>
      <v-btn :href="`https://www.binance.com/en/futures/${info.id}`" target="_blank">
        Trade
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps({
  info: {
    required: true
  }
})
const color = computed(()=> props.info.signalTotal > 0 ? 'green': 'red')
const indicators = computed(()=>Object.fromEntries(
  Object.entries(props.info.indicators).filter(([key, value]) => value !== 0)
))

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
</script>

<style></style>