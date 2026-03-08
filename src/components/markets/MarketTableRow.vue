<script setup>
import { ref, computed, watch } from 'vue'
import MarketTableCell from './MarketTableCell.vue'

// Get data passed from parent with defineProps
const market = defineProps(['symbol', 'index', 'price', 'change24hPercent', 'change24h', 'volumeCoin', 'volumeUSD', 'lastItem'])
</script>

<template>
  <tr>
    <MarketTableCell :value="market.index" type="index" :isLast="market.lastItem" />
    <MarketTableCell :value="market.symbol" type="symbol" :isLast="market.lastItem" />
    <MarketTableCell :value="market.price" type="usd" :isLast="market.lastItem" />
    <MarketTableCell :value="market.change24hPercent" type="percent" :isLast="market.lastItem" />
    <MarketTableCell :value="market.change24h" type="usd" :isLast="market.lastItem" />
    <MarketTableCell :value="market.volumeCoin" type="volume" :isLast="market.lastItem" />
    <MarketTableCell :value="market.volumeUSD" type="usd" :isLast="market.lastItem" />
  </tr>
</template>

<style scoped>
.hr {
  border-bottom: 1px solid var(--border-subtle);
}

tr:hover {
  background-color: var(--bg-surface);
  cursor: pointer;
}
</style>
