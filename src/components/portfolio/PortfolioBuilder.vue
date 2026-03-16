/**
STRUCTURE:
- ref -> selectedCoins
- object -> coinHistory
- backend -> binance fetch history (only if not already in coinHistory)
- frontend -> coin selector, date picker for entry, lineChart, fetch available coins for coin selector (use ticker from
cointable)
*/
<script setup>
import { ref } from 'vue';
import { appState } from '../stores/crypto.js'
const selectedCoins = ref([])
const coinHistory = {}

// Fetch coin history from binance (backend)
const fetchCoin = (coin) => {

}

// Load markets if not already done
async function loadMarkets() {
    if (Object.entries(appState.crypto).length == 0) {
        let tickers = await fetch("https://api.binance.com/api/v3/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
        tickers = tickers.filter(item => item.symbol.endsWith("USDT"))
        tickers = tickers.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
        appState.cryptos = tickers
    }
}
</script>

<template>
    <div>
    </div>
</template>

<style scoped></style>