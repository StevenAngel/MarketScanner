<script setup>
import { onMounted, ref } from 'vue'
const mainSymbols = ['BTC', 'ETH', 'SOL', 'POL', 'XRP', 'ADA', 'BNB', 'DOGE', 'TRX', 'BCH']
const mainSymbolsData = ref([])

// Load and transform data for main symbols in marquee bar
async function loadCoinData() {
    const tickers = await fetch("https://api.binance.com/api/v3/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
    mainSymbolsData.value = tickers.filter(item => item.symbol.endsWith("USDT")).filter(item => mainSymbols.includes(item.symbol.replace("USDT", ""))).map(item => {
        const symbol = item.symbol.replace("USDT", "")
        if (mainSymbols.includes(symbol)) {
            // +item.lastPrice to go from 72032.38000000 to 72032.38
            return { symbol, price: +item.lastPrice, change: item.priceChangePercent }
        }
    })
}

onMounted(loadCoinData)
</script>

<template>
    <div class="marqueeBar">
        <div class="marqueeContent">
            <span v-for="value in mainSymbolsData" :key="value.symbol"
                :class="['marqueeElement', value.change >= 0 ? 'green' : 'red']">🔥 {{
                    value.symbol }}: ${{
                    value.price }} ({{
                    value.change }}%)</span>

            <span v-for="value in mainSymbolsData" :key="value.symbol + '-copy'"
                :class="['marqueeElement', value.change >= 0 ? 'green' : 'red']">
                🔥 {{ value.symbol }}: ${{ value.price }} ({{ value.change }}%)
            </span>
        </div>
    </div>
</template>

<style scoped>
.marqueeBar {
    width: 100%;
    height: 2rem;
    border-bottom: 1px solid var(--border-subtle);
    overflow: hidden;
}

.marqueeContent {
    display: flex;
    height: 100%;
    width: max-content;
    /* Kein Zeilenumbruch */
    white-space: nowrap;
    gap: 2rem;
    padding-left: 2rem;
    align-items: center;
    /* Hier die Animation zuweisen */
    animation: scroll 30s linear infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}

.marqueeContent:hover {
    animation-play-state: paused;
}

.green {
    color: var(--crypto-up);
}

.red {
    color: var(--crypto-down);
}
</style>