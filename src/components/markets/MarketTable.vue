<script setup>
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import MarketTableRow from './MarketTableRow.vue'

let socket = null

// ShallowRef is not deep reactive, only on markets.value change, not markets.value[symbol] = xyz 
const markets = ref({
  // BTC: { price: '5000', change24hPercent: '-2%', change24h: '-1000', volumeCoin: '1', volumeUSD: '1' },
})

// Throttling data
let internalMarkets = {}
let throttleTimer = null

// Updates markets ref() every 200ms
const updateData = (newData) => {
  if (!throttleTimer) {
    throttleTimer = setTimeout(() => {
      // {...newData} needed because newData would point at the same reference so vue does not "see" new data
      markets.value = { ...newData }
      throttleTimer = null
    }, 200)
  }
}

const sortMarkets = (value) => {
  switch (value) {
    case 'symbol':
      console.log("symbol")
  }
}

// Connect websocket onMount, subscribe to all tickers onOpen
const connect = () => {
  const socket = new WebSocket('wss://data-stream.binance.vision/ws')
  socket.onopen = () => {
    console.log('Connected to Binance WebSocket')
    const subscriptions = Array.from(Object.keys(markets.value), (value) => { return (value.toLowerCase() + "usdt@ticker") })
    socket.send(JSON.stringify({
      "method": "SUBSCRIBE",
      "params": subscriptions,
      "id": 1
    }))
  }

  socket.onmessage = (event) => {
    event = JSON.parse(event.data)
    if (event.e == "24hrTicker") {
      const symbol = event.s.replace('USDT', '')
      if (!internalMarkets[symbol]) internalMarkets[symbol] = {}
      internalMarkets[symbol].price = event.c
      internalMarkets[symbol].change24hPercent = event.P
      internalMarkets[symbol].change24h = event.p
      internalMarkets[symbol].volumeCoin = event.v
      internalMarkets[symbol].volumeUSD = event.q
      updateData(internalMarkets)
    }
  }
}

/**
 * Fetch and filter all markets from binance.
 * Returns the top 100 coins / tokens
 */
async function loadMarkets() {
  let tickers = await fetch("https://api.binance.com/api/v3/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
  tickers = tickers.filter(item => item.symbol.endsWith("USDT"))
  tickers = tickers.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
  tickers = tickers.slice(0, 100)
  tickers = tickers.forEach(ticker => {
    internalMarkets[ticker.symbol.replace("USDT", "")] = { price: ticker.askPrice, change24hPercent: ticker.priceChangePercent, change24h: ticker.priceChange, volumeCoin: ticker.volume, volumeUSD: ticker.quoteVolume }
    markets.value[ticker.symbol.replace("USDT", "")] = { price: ticker.askPrice, change24hPercent: ticker.priceChangePercent, change24h: ticker.priceChange, volumeCoin: ticker.volume, volumeUSD: ticker.quoteVolume }
  })
}

// Open socket onMounted, close onUnmounted
onMounted(async () => {
  await loadMarkets();
  connect()
})
onUnmounted(() => socket?.close())
</script>

<template>
  <div>
    <div class="container">
      <table>
        <thead>
          <tr>
            <th @click="sortMarkets('symbol')">
              <div class="headerContent">
                <span>
                  SYMBOL
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div class="headerContent">
                <span>
                  PRICE
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div class="headerContent">
                <span>
                  CHANGE %
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div class="headerContent">
                <span>
                  CHANGE USD
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div class="headerContent">
                <span>
                  VOLUME
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th>
              <div class="headerContent">
                <span>
                  VOLUME USD
                </span>
                <div class="arrowContainer">
                  <span>
                    ▲
                  </span>
                  <span>
                    ▼
                  </span>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <MarketTableRow v-for="(data, symbol, index) in markets" :symbol="symbol" :price="data.price"
            :change24hPercent="data.change24hPercent" :change24h="data.change24h" :volumeCoin="data.volumeCoin"
            :volumeUSD="data.volumeUSD" :lastItem="index != Object.keys(markets).length - 1" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin: 1rem;
}

table {
  width: 100%;
  overflow-x: auto;
}

th {
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
}

.headerContent {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
}

.arrowContainer {
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
}
</style>
