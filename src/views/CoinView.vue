<script setup>
import { onMounted, ref } from 'vue';

// Props from url
const props = defineProps({
    coin: {
        type: String,
        default: 'BTC'
    }
});

const container = ref(null)
const coinData = ref(null)
const loading = ref(true)
// Create tradingview embedding for chart
const createWidget = () => {
    if (container.value) {
        container.value.innerHTML = ''
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.type = 'text/javascript'
    script.async = true

    // Hier konfigurieren wir das Widget dynamisch
    script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": `BINANCE:${props.coin}USDT`, // Dynamisch durch Props!
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "hide_side_toolbar": true,
        "allow_symbol_change": true,
        "calendar": false,
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        "support_host": "https://www.tradingview.com"
    })

    container.value.appendChild(script)
};

const fetchCoinData = async () => {
    coinData.value = await fetch("http://localhost:3000/coinData", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ coin: props.coin })
    }).then(res => res.json()).catch(err => console.error(err))
}

onMounted(() => {
    fetchCoinData()
    createWidget()
});
</script>

<template>
    <div class="coinHeader">
        <div v-if="loading" class="skeleton-circle"></div>
        <img v-else-if="coinData" :src="coinData.logo" />

    </div>
    <div class="tradingview-widget-container" ref="container">
        <div class="tradingview-widget-container__widget"></div>
    </div>
</template>

<style scoped>
.tradingview-widget-container {
    /* Oder was auch immer du brauchst */
    width: 100%;
    height: 1000px;
}

.tradingview-widget-container__widget {
    width: 100%;
    height: 1000px;
}
</style>