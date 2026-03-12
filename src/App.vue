<script setup>
import Navbar from './components/layout/Navbar.vue'

/**
 * Reowned appkit for vue to connect your wallet
 * Whole setup below
 */
import { createAppKit } from '@reown/appkit/vue'
import { arbitrum, mainnet, bsc, solana, base, polygon, bitcoin } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// 1. Get projectId from https://dashboard.reown.com
const projectId = '405b736f468ab2233b22a972db05ef72'

// 2. Create a metadata object
const metadata = {
  name: 'Portfolio Viewer',
  description: 'Shows portfolio in a pie chart',
  url: 'http://localhost:5173', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 3. Set the networks
const networks = [mainnet, bsc, arbitrum, solana, base, polygon, bitcoin]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// 5. Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  },
  enableReconnect: true
})
</script>

<template>
  <Navbar />
  <!-- v-slot extracts current component vue wants to render as variable -->
  <!-- keep-alive does not rerender the included page (or all pages if none included) if it was rendered once -->
  <!-- <component> is a placeholder for a dynamic component, ":is" tells the dynamic component to take our variable that we extracted and render it here  -->
  <router-view v-slot="{ Component }">
    <keep-alive include="PortfolioView">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<style scoped></style>
