<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MarketTableRow from './MarketTableRow.vue'

let socket = null
let sortConfig = ref({})
const markets = ref({
  // BTC: { price: '5000', change24hPercent: '-2%', change24h: '-1000', volumeCoin: '1', volumeUSD: '1' },
})

/**
 * Computed value that sorts markets depending on the current sortConfig
 * Is used to pass properties to MarketTableRow component
 */
const sortedMarkets = computed(() => {
  const marketsArray = Object.entries(markets.value)
  if (sortConfig.value.key != "symbol") {
    marketsArray.sort(([, a], [, b]) => {
      if (sortConfig.value.direction == "asc") {
        return a[sortConfig.value.key] - b[sortConfig.value.key]
      } else if (sortConfig.value.direction == "desc") {
        return b[sortConfig.value.key] - a[sortConfig.value.key]
      }
    })
  } else {
    marketsArray.sort(([a,], [b,]) => {
      if (sortConfig.value.direction == "asc") {
        return a.localeCompare(b)
      } else {
        return b.localeCompare(a)
      }
    })
  }

  return Object.fromEntries(marketsArray)
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

/**
 * Change key and direction of sortConfig
 * "key" must match one of the markets.value properties
 */
const sortMarkets = (key) => {
  if (sortConfig.value.key == key) {
    sortConfig.value.direction = sortConfig.value.direction == "desc" ? "asc" : "desc"
  } else {
    sortConfig.value.key = key
    sortConfig.value.direction = "desc";
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
      internalMarkets[symbol].changePercent = event.P
      internalMarkets[symbol].change = event.p
      internalMarkets[symbol].volume = event.v
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
  tickers = tickers.forEach((ticker, index) => {
    internalMarkets[ticker.symbol.replace("USDT", "")] = { index: index + 1, price: ticker.askPrice, changePercent: ticker.priceChangePercent, change: ticker.priceChange, volume: ticker.volume, volumeUSD: ticker.quoteVolume }
    markets.value[ticker.symbol.replace("USDT", "")] = { index: index + 1, price: ticker.askPrice, changePercent: ticker.priceChangePercent, change: ticker.priceChange, volume: ticker.volume, volumeUSD: ticker.quoteVolume }
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
  <div class="container">
    <table>
      <thead>
        <tr>
          <th @click="sortMarkets('index')">
            <div class="headerContent">
              <span>
                #
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
          <th @click="sortMarkets('price')">
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
          <th @click="sortMarkets('changePercent')">
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
          <th @click="sortMarkets('change')">
            <div class="headerContent">
              <span>
                CHANGE $
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
          <th @click="sortMarkets('volume')">
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
          <th @click="sortMarkets('volumeUSD')">
            <div class="headerContent">
              <span>
                VOLUME $
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
        <MarketTableRow v-for="(data, symbol, index) in sortedMarkets" :symbol="symbol" :index="data.index"
          :price="data.price" :changePercent="data.changePercent" :change="data.change" :volume="data.volume"
          :volumeUSD="data.volumeUSD" :lastItem="index != Object.keys(markets).length - 1" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
  flex: 1;
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
