<script setup>
import Logo from '../../assets/branding/logo.png'
import WalletConnectButton from '../walletConnect/WalletConnectButton.vue';
import LightModeSwitch from './LightModeSwitch.vue';
</script>

<template>
    <div class="bottombar">
        <div class="sectionColumn">
            <div class="innerSection">
                <router-link to="/" class="bottombarItem"><img :src="Logo" class="logo" /></router-link>
                <div class="links">
                    <router-link to="/" class="bottombarItem">Home</router-link>
                    <router-link to="/news" class="bottombarItem">News</router-link>
                    <router-link to="/portfolio" class="bottombarItem">Portfolio</router-link>
                </div>



            </div>
            <div class="bottom">
                <small>Made with ❤️ by Steven Engel — <a href="https://github.com/StevenAngel/MarketScanner"
                        target="_blank" class="link">[GitHub]</a>
                </small>
            </div>
        </div>
        <div class="sectionColumn">
            <p>
                Tech Stack & Data
            </p>
            <div class="stack-icons">
                <span title="Node.js"><img src="https://icon.icepanel.io/Technology/svg/Node.js.svg" class="tech-badge"
                        alt="Node.js" /></span>
                <span title="Express"><img src="https://icon.icepanel.io/Technology/png-shadow-512/Express.png"
                        class="tech-badge" alt="Express" /></span>
                <span title="Vue 3"><img src="https://icon.icepanel.io/Technology/svg/Vue.js.svg" class="tech-badge"
                        alt="Vue 3" /></span>
                <span title="Vite"><img src="https://icon.icepanel.io/Technology/svg/Vite.js.svg" class="tech-badge"
                        alt="Vite" /></span>
                <span title="ECharts"><img src="https://raw.githubusercontent.com/nuxt/modules/main/icons/echarts.svg"
                        class="tech-badge" alt="Binance API" /></span>
                <span title="Binance API"><img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Binance_Logo.png/960px-Binance_Logo.png"
                        class="tech-badge" alt="Binance API" /></span>
                <span title="CoinMarketCap API"><img
                        src="https://images.icon-icons.com/3911/PNG/512/coinmarketcap_logo_icon_247296.png"
                        class="tech-badge" alt="CoinMarketCap API" /></span>
                <span title="Reown"><img
                        src="https://reown.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fuvy10p5b%2Fproduction%2F01495a4964c8df30a7e8859c4f469e67dc9545a2-1024x1024.png&w=3840&q=100"
                        class="tech-badge" alt="Reown" /></span>
            </div>
            <div class="features">
                <p>🌐 <strong>REST:</strong> Historical Data & Market Overview</p>
                <p>⚡ <strong>WS:</strong> Live Price Updates</p>
                <p>📡 <strong>RSS:</strong> Crypto News Feed</p>
            </div>
        </div>
        <div class="sectionRow">
            <div class="buttonsRight">
                <LightModeSwitch />
                <WalletConnectButton />
            </div>
        </div>
    </div>
</template>

<style scoped>
.bottombar {
    width: 100%;
    background-color: var(--bg-main);
    color: var(--text-primary);
    /* position: sticky;
    top: 0; */
    z-index: 100;
    border-top: 1px solid var(--border-subtle);
    user-select: none;
    display: flex;
    gap: 1rem;
}

.sectionColumn {
    display: flex;
    flex-direction: column;
    margin: 1rem;
}

.sectionRow {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1rem;
    margin-left: auto;
}

.stack-icons {
    display: flex;
    gap: .5rem;
}

.tech-badge {
    width: 50px;
    height: 50px;
    transition: linear 0.2s;
}

.tech-badge:hover {
    transform: scale(1.2);
    transition: linear 0.2s;
}

.innerSection {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 1.5rem;
}

.bottombarItem {
    text-decoration: none;
    color: inherit;
}

.link {
    text-decoration: none;
    color: blueviolet;
}

.bottombarItem:visited {
    color: inherit;
}

.bottom {
    margin-top: auto;
}

.links {
    display: flex;
    flex-direction: column;
    gap: .25rem;
}

.logo {
    height: 5rem;
}

.buttonsRight {
    margin-left: auto;
    display: flex;
    align-items: inherit;
    gap: inherit;
}
</style>