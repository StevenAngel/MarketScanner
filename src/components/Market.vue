<script setup>
import { computed } from 'vue'

// Get data passed from parent with defineProps
const market = defineProps(['symbol', 'price', 'change24hPercent', 'change24h', 'volumeCoin', 'volumeUSD'])
const marketPrice = computed(() => market.price + '€')
</script>

<template>
  <div class="market">
    <div class="flex-1">{{ market.symbol }}</div>
    <div class="flex-1">{{ marketPrice }}</div>
    <div class="flex-1">{{ market.change24h }}</div>
    <div class="flex-1">{{ market.change24hPercent }}</div>
    <div class="flex-1">{{ market.volumeCoin }}</div>
    <div class="flex-1">{{ market.volumeUSD }}</div>
  </div>
</template>

<style scoped>
.market {
  display: flex;
}

.flex-1 {
  flex: 1
}
</style>
