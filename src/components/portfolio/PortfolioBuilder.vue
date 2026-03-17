/**
STRUCTURE:
- ref -> selectedCoins
- object -> coinHistory
- backend -> binance fetch history (only if not already in coinHistory)
- frontend -> coin selector, date picker for entry, lineChart, fetch available coins for coin selector (use ticker from
cointable)
*/
<script setup>
import CryptoSelector from './CryptoSelector.vue';
import { onMounted, ref, watch } from 'vue';
import { appState } from '../stores/crypto.js'
const selectableCoins = ref([])
const selectedCoins = ref([])
const coinHistory = {}

watch(selectedCoins, (newVal, oldValue) => {

})

// Fetch coin history from binance (backend)
const fetchCoin = (coin, isChecked) => {
    if (isChecked) {
        selectedCoins.value.push(coin)
        if (!coinHistory[coin]) {

        }
    } else {
        const index = selectedCoins.value.indexOf(coin)
        if (index > -1) selectedCoins.value.splice(index, 1)
    }
}

// Load markets if not already done
async function loadMarkets() {
    if (Object.entries(appState.cryptos).length == 0) {
        let tickers = await fetch("https://api.binance.com/api/v3/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
        tickers = tickers.filter(item => item.symbol.endsWith("USDT"))
        tickers = tickers.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
        selectableCoins.value = tickers.map((value) => value.symbol.replace("USDT", ""))
        appState.cryptos = selectableCoins.value;
    }
}

onMounted(loadMarkets)
</script>

<template>
    <!-- v-model for bidirectional tunnel from parent to child and child to parent -->
    <CryptoSelector :selectableCoins="selectableCoins" v-model="selectedCoins" @coinSelected="fetchCoin" />
</template>

<style scoped></style>