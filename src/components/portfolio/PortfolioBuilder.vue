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
import { onMounted, ref, computed } from 'vue';
import { appState } from '../stores/crypto.js'
import LineChart from '../charts/LineChart.vue';
const portfolioPercent = ref({})
const selectableCoins = ref([])
const selectedCoins = ref([])
const coinHistory = ref({})
const portfolioStartDate = ref(null)
const portfolioValue = ref(1000)
const linechartData = computed(() => {
    let internalLinechartData = {}
    let linechartData = {}
    const activeCoins = selectedCoins.value.filter(coin => coinHistory.value[coin])
    const allPercent = activeCoins.length > 0 ? activeCoins.reduce((accumulator, coin) => Number(accumulator) + Number(portfolioPercent.value[coin]), 0) : 100
    activeCoins.forEach(coin => {
        const relativePercent = portfolioPercent.value[coin] / allPercent || 1
        const coinAmount = (portfolioValue.value * relativePercent) / Number(coinHistory.value[coin][0].price)
        coinHistory.value[coin].forEach(value => {
            if (!internalLinechartData[value.time]) {
                internalLinechartData[value.time] = coinAmount * Number(value.price)
            } else {
                internalLinechartData[value.time] += coinAmount * Number(value.price)
            }
        })
    })

    internalLinechartData = Object.fromEntries(Object.entries(internalLinechartData).sort((a, b) => a.time - b.time))
    linechartData.linechartDataX = Object.entries(internalLinechartData).map(value => new Date(Number(value[0])).toLocaleDateString())
    linechartData.linechartDataY = Object.entries(internalLinechartData).map(value => value[1])
    return linechartData
})

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
        // Set portfolio percent value
        portfolioPercent.value[coin] = 100
        selectedCoins.value.push(coin)
        if (!coinHistory.value[coin] || Number(coinHistory.value[coin][0].time) > portfolioStartDate.value) {
            const history = await fetch("http://localhost:3000/coinHistory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ coin, timestamp: portfolioStartDate.value })
            }).then(res => res.json()).catch(err => console.error(err))
            coinHistory.value[coin] = history
        }
    } else {
        const index = selectedCoins.value.indexOf(coin)
        if (index > -1) selectedCoins.value.splice(index, 1)
    }
}

const fetchCoinsToDate = async (date) => {
    const timestamp = new Date(date.target.value).getTime()
    portfolioStartDate.value = timestamp;
    selectedCoins.value.forEach(async (coin) => {
        if (Number(coinHistory.value[coin][0].time) > timestamp) {
            const history = await fetch("http://localhost:3000/coinHistory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ coin, timestamp: portfolioStartDate.value })
            }).then(res => res.json()).catch(err => console.error(err))
            coinHistory.value[coin] = history
        }
    })
}

const updatePortfolioValue = (input) => {
    if (input.target.value != '') portfolioValue.value = Number(input.target.value)
}

const updatePortfolioPercent = (coin, percent) => {
    const value = Math.max(0, Number(percent));
    portfolioPercent.value[coin] = value
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
                <input type="date" @input="fetchCoinsToDate" />
            </div>
        </div>
        <div class="portfolio">
            <CryptoSelector :selectableCoins="selectableCoins" @coinSelected="fetchCoin"
                @coinPercentSelected="updatePortfolioPercent" />
            <LineChart class="chart" :lineChartDataX="linechartData.linechartDataX"
                :lineChartDataY="linechartData.linechartDataY" :loading="false" :loading-options="loadingOptions" />
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