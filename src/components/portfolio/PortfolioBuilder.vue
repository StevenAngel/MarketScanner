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
import { onMounted, ref } from 'vue';
import { appState } from '../stores/crypto.js'
import LineChart from '../charts/LineChart.vue';
const selectableCoins = ref([])
const selectedCoins = ref([])
let linechartData = {}
const linechartDataX = ref([])
const linechartDataY = ref([])
const coinHistory = {}
const loadingOptions = {
    text: 'Loading...',
    color: '#6366f1',
    textColor: '#fff',
    fontSize: 24,
    fontWeight: 600,
    maskColor: 'rgba(0, 0, 0, 0.8)',
    zlevel: 0
};

// Fetch coin history from binance (backend)
const fetchCoin = async (coin, isChecked) => {
    if (isChecked) {
        selectedCoins.value.push(coin)
        if (!coinHistory[coin]) {
            const history = await fetch("http://localhost:3000/coinHistory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json" // Sag dem Server: "Hier kommt JSON!"
                },
                body: JSON.stringify({ coin: coin })
            }).then(res => res.json()).catch(err => console.error(err))
            coinHistory[coin] = history
        }
    } else {
        const index = selectedCoins.value.indexOf(coin)
        if (index > -1) selectedCoins.value.splice(index, 1)
    }

    updateLineChart()
}

const updateLineChart = () => {
    linechartData = {}
    selectedCoins.value.forEach(coin => {
        coinHistory[coin].forEach(value => {
            if (!linechartData[value.time]) {
                linechartData[value.time] = Number(value.price)
            } else {
                linechartData[value.time] += Number(value.price)
            }
        })
    })


    linechartDataX.value = Object.entries(linechartData).map(value => value[0])
    linechartDataY.value = Object.entries(linechartData).map(value => value[1])
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
    <CryptoSelector :selectableCoins="selectableCoins" @coinSelected="fetchCoin" />
    <LineChart class="chart" :lineChartDataX="linechartDataX" :lineChartDataY="linechartDataY" :loading="false"
        :loading-options="loadingOptions" />
</template>

<style scoped>
.chart {
    height: 400px;
}
</style>