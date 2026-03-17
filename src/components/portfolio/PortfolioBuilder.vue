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
const linechartDataX = ref([])
const linechartDataY = ref([])
const portfolioValue = ref(1000)
let linechartData = {}
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

const updatePortfolioValue = (input) => {
    if (input.target.value != '') portfolioValue.value = Number(input.target.value)
    updateLineChart()
}

const updateLineChart = () => {
    linechartData = {}
    selectedCoins.value.forEach(coin => {
        const coinAmount = (portfolioValue.value / selectedCoins.value.length) / Number(coinHistory[coin][0].price)
        coinHistory[coin].forEach(value => {
            if (!linechartData[value.time]) {
                linechartData[value.time] = coinAmount * Number(value.price)
            } else {
                linechartData[value.time] += coinAmount * Number(value.price)
            }
        })
    })

    linechartData = Object.fromEntries(Object.entries(linechartData).sort((a, b) => a.time - b.time))
    linechartDataX.value = Object.entries(linechartData).map(value => new Date(Number(value[0])).toLocaleDateString())
    linechartDataY.value = Object.entries(linechartData).map(value => value[1])
}

// Load markets if not already done
async function loadMarkets() {
    if (Object.entries(appState.cryptos).length == 0) {
        let tickers = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
        tickers = tickers.filter(item => item.symbol.endsWith("USDT"))
        tickers = tickers.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
        selectableCoins.value = tickers.map((value) => value.symbol.replace("USDT", ""))
        appState.cryptos = selectableCoins.value;
    }
}

onMounted(loadMarkets)
</script>

<template>
    <div class="portfolioWrapper">
        <div class="portfolioData">
            <div>
                <p>
                    Portfolio start value in $:
                </p>
                <input type="number" placeholder="1000" @input="updatePortfolioValue" />
            </div>
            <div>
                <p>
                    Portfolio start date:
                </p>
                <input type="date" />
            </div>
        </div>
        <div class="portfolio">
            <CryptoSelector :selectableCoins="selectableCoins" @coinSelected="fetchCoin" />
            <LineChart class="chart" :lineChartDataX="linechartDataX" :lineChartDataY="linechartDataY" :loading="false"
                :loading-options="loadingOptions" />
        </div>
    </div>
</template>

<style scoped>
.portfolioWrapper {
    margin: 1rem;
}

.portfolioData {
    display: flex;
    gap: 1rem;
}

.portfolio {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.chart {
    height: 400px;
}
</style>