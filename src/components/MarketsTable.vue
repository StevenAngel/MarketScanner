<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Market from './MarketRow.vue'

let socket = null
const markets = ref({
  // BTC: { price: '5000', change24hPercent: '-2%', change24h: '-1000', volumeCoin: '1', volumeUSD: '1' },
})

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

  //**
  // Event:
  // {"e":"24hrTicker","E":1772574569035,"s":"BTCUSDT","p":"-1437.89000000",
  //  "P":"-2.071","w":"67834.63514256","x":"69442.02000000","c":"68004.12000000",
  //  "Q":"0.00250000","b":"68004.11000000","B":"0.25511000","a":"68004.12000000",
  //  "A":"1.46494000","o":"69442.01000000","h":"69506.94000000","l":"66158.00000000",
  //  "v":"25691.57255000","q":"1742778450.16795780","O":1772488169013,
  //  "C":1772574569013,"F":6046790866,"L":6054521811,"n":7730946}
  //  */
  socket.onmessage = (event) => {
    event = JSON.parse(event.data)
    if (event.e == "24hrTicker") {
      const symbol = event.s.replace('USDT', '')
      const price = event.c
      markets.value[symbol].price = price
      markets.value[symbol].change24hPercent = event.P
      markets.value[symbol].change24h = event.p
      markets.value[symbol].volumeCoin = event.v
      markets.value[symbol].volumeUSD = event.q
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
            <th class="firstChild">
              SYMBOL
            </th>
            <th>
              PRICE
            </th>
            <th>
              CHANGE %
            </th>
            <th>
              CHANGE USD
            </th>
            <th>
              VOLUME
            </th>
            <th class="lastChild">
              VOLUME USD
            </th>
          </tr>
        </thead>
        <tbody>
          <Market v-for="(data, symbol, index) in markets" :symbol="symbol" :price="data.price"
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

th {
  border-bottom: 2px solid;
}
</style>
