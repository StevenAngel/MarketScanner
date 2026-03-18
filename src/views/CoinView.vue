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
        "autosize": false,
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
    <div class="coinPageWrapper">
        <div v-if="coinData" class="coinHeader">
            <div class="leftHeader">
                <img :src="coinData.logo" :alt="coinData.name + ' Logo'" />
                <div class="nameLaunched">
                    <h2>{{ coinData.name }}</h2>
                    <small v-if="coinData.launched" class="date">{{ new Date(coinData.launched).toLocaleDateString()
                    }}</small>
                </div>
            </div>
            <div class="rightHeader">
                <a v-if="coinData.website" class="link" target="_blank"
                    :href="coinData.website"><small>[Website]</small></a>
                <a v-if="coinData.explorer" class="link" target="_blank"
                    :href="coinData.explorer"><small>[Blockexplorer]</small></a>
                <a v-if="coinData.technicalDocs" class="link" target="_blank"
                    :href="coinData.technicalDocs"><small>[Whitepaper]</small></a>
                <a v-if="coinData.sourceCode" class="link" target="_blank" :href="coinData.sourceCode"><small>[Source
                        Code]</small></a>
                <a v-if="coinData.reddit" target="_blank" :href="coinData.reddit"><img class="socialIcon"
                        src="https://www.iconpacks.net/icons/5/free-reddit-circle-logo-icon-16620.png"
                        alt="Reddit Logo" /></a>
                <a v-if="coinData.twitter" target="_blank" :href="coinData.twitter"><img class="socialIcon"
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/X_icon.svg/960px-X_icon.svg.png?_=20250519203220"
                        alt="X Logo" /></a>
            </div>
        </div>
        <div class="chartWrapper">
            <div class="tradingview-widget-container" ref="container">
                <div class="tradingview-widget-container__widget"></div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.coinPageWrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem;
    height: 100%;
}

.chartWrapper {
    width: 100%;
    height: 600px;
}

.coinHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.leftHeader {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.rightHeader {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nameLaunched {
    display: flex;
    flex-direction: column;
}

.date {
    color: var(--text-secondary)
}

.socialIcon {
    width: 50px;
    height: 50px;
}

.link {
    text-decoration: none;
    color: blueviolet;
}
</style>