<script setup>
import { ref, computed, watch } from 'vue'
import MarketCell from './MarketCell.vue'

// Get data passed from parent with defineProps
const market = defineProps(['symbol', 'price', 'change24hPercent', 'change24h', 'volumeCoin', 'volumeUSD', 'lastItem'])
console.log(market.change24hPercent, market.change24h, "CHECK")
</script>

<template>
  <tr>
    <MarketCell :value="market.symbol" type="symbol" :isLast="market.lastItem" />
    <MarketCell :value="market.price" type="usd" :isLast="market.lastItem" />
    <MarketCell :value="market.change24hPercent" type="percent" :isLast="market.lastItem" />
    <MarketCell :value="market.change24h" type="usd" :isLast="market.lastItem" />
    <MarketCell :value="market.volumeCoin" type="volume" :isLast="market.lastItem" />
    <MarketCell :value="market.volumeUSD" type="usd" :isLast="market.lastItem" />
  </tr>
</template>

<style scoped>
.hr {
  border-bottom: 1px solid black;
}

tr:hover {
  background-color: #bbbbbb5e;
  cursor: pointer;
}
</style>
