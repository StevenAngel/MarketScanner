<script setup>
import { ref, computed } from 'vue'

// Get data passed from parent with defineProps
const market = defineProps(['symbol', 'price', 'change24hPercent', 'change24h'])
const marketPrice = computed(() => market.price + '€')
</script>

<template>
  <div class="market">
    <p>{{ market.symbol }}</p>
    <p>{{ marketPrice }}</p>
    <p>{{ market.change24h }}</p>
    <p>{{ market.change24hPercent }}</p>
  </div>
</template>

<style scoped>
.market {
  display: flex;
  gap: 2em;
}
</style>
