<script setup>
import { appState } from '../stores/crypto.js'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MarketTableRow from './MarketTableRow.vue'
import CustomButton from '../layout/CustomButton.vue'
let socket = null
const sortConfig = ref({ key: "index", direction: "asc" })
const showMoreTokens = ref(false) // Subscribe / unsubscribe websocket on toggle
const showMoreButtonText = ref('SHOW TOP 200')
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
        return Number(a[sortConfig.value.key]) - Number(b[sortConfig.value.key])
      } else if (sortConfig.value.direction == "desc") {
        return Number(b[sortConfig.value.key]) - Number(a[sortConfig.value.key])
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
  if (showMoreTokens.value) {
    return marketsArray
  } else {
    return marketsArray.slice(0, 100)
  }

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
  const socket = new WebSocket('wss://fstream.binance.com/ws/market')
  socket.onopen = () => {
    console.log('Connected to Binance WebSocket')
    const subscriptions = Array.from(Object.keys(internalMarkets), (value) => { return (value.toLowerCase() + "usdt@ticker") })
    socket.send(JSON.stringify({ method: "SUBSCRIBE", params: subscriptions }))
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
 * Shows more / less tokens on button click
 */
const showMore = () => {
  showMoreTokens.value = !showMoreTokens.value
  if (showMoreTokens.value) {
    showMoreButtonText.value = "SHOW TOP 100"
    // markets.value = { ...internalMarkets }
  } else {
    showMoreButtonText.value = "SHOW TOP 200"
    // markets.value = Object.fromEntries(Object.entries(internalMarkets).slice(0, 100))
  }
}

/**
 * Fetch and filter all markets from binance.
 * Returns the top 100 coins / tokens
 */
async function loadMarkets() {
  let tickers = await fetch("https://fapi.binance.com/fapi/v1/ticker/24hr").then(res => res.json()).catch(err => console.error(err))
  tickers = tickers.filter(item => item.symbol.endsWith("USDT"))
  tickers = tickers.sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
  if (Object.entries(appState.cryptos).length == 0) {
    appState.cryptos = tickers
  }

  tickers = tickers.slice(0, 200)
  tickers = tickers.forEach((ticker, index) => {
    internalMarkets[ticker.symbol.replace("USDT", "")] = { index: index + 1, price: ticker.lastPrice, changePercent: ticker.priceChangePercent, change: ticker.priceChange, volume: ticker.volume, volumeUSD: ticker.quoteVolume }
  })
  markets.value = Object.fromEntries(Object.entries(internalMarkets).sort((a, b) => Number(a[1].index) - Number(b[1].index)))
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
        <MarketTableRow v-for="(data, index) in sortedMarkets" :key="index" :symbol="data[0]" :index="data[1].index"
          :price="data[1].price" :changePercent="data[1].changePercent" :change="data[1].change"
          :volume="data[1].volume" :volumeUSD="data[1].volumeUSD"
          :lastItem="index != Object.keys(markets).length - 1" />
      </tbody>
    </table>
    <div class="showMoreButtonWrapper">
      <CustomButton class="showMoreButton" :text="showMoreButtonText" @click="showMore()" />
    </div>
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

.showMoreButtonWrapper {
  display: flex;
  justify-content: center;
}

.showMoreButton {
  font-weight: inherit;
}
</style>
