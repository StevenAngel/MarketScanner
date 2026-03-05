<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Market from './Market.vue'

let socket = null
const markets = ref({
  BTC: { price: '5000', change24hPercent: '-2%', change24h: '-1000' },
  ETH: { price: '5000', change24hPercent: '-2%', change24h: '-1000' },
})

/**
* Connect websocket onMount, subscribe tickers onOpen
*/
const connect = () => {
  const socket = new WebSocket('wss://data-stream.binance.vision/ws')
  socket.onopen = () => {
    console.log('Connected to Binance WebSocket')
    socket.send(JSON.stringify({
      "method": "SUBSCRIBE",
      "params": ["btcusdt@ticker", "ethusdt@ticker"],
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
    console.log(event)
    const symbol = event.s.replace('USDT', '')
    const price = event.c
    markets.value[symbol].price = price
    markets.value[symbol].change24hPercent = event.P
    markets.value[symbol].change24h = event.p
  }
}

// Öffne socket bei Mount, schließe bei Unmount
onMounted(() => connect())
onUnmounted(() => socket?.close())
</script>

<template>
  <Market v-for="(data, symbol) in markets" :symbol="symbol" :price="data.price"
    :change24hPercent="data.change24hPercent" :change24h="data.change24h" />
</template>

<style scoped></style>
