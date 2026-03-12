<script setup>
import Logo from '../../assets/branding/logo.png'
import WalletConnectButton from '../walletConnect/WalletConnectButton.vue';
</script>

<template>
    <div class="navbar">
        <div class="innerNavbar">
            <!-- router-link is vue element for <a> for loading new page without reloading whole site -->
            <router-link to="/" class="navbarItem"><img :src="Logo" class="logo" /></router-link>
            <router-link to="/news" class="navbarItem">News</router-link>
            <router-link to="/portfolio" class="navbarItem">Portfolio</router-link>
            <WalletConnectButton class="web3Login" />
        </div>
    </div>
</template>

<style scoped>
.navbar {
    width: 100%;
    background-color: var(--bg-main);
    color: var(--text-primary);
    /* position: sticky;
    top: 0; */
    z-index: 100;
    border-bottom: 1px solid var(--border-subtle);
}

.innerNavbar {
    display: flex;
    gap: 1rem;
    margin: 1rem;
    align-items: center;
    font-size: 1.5rem;
}

.navbarItem {
    text-decoration: none;
    color: inherit;
}

.navbarItem:visited {
    color: inherit;
}

.logo {
    height: 5rem;
}

.web3Login {
    margin-left: auto;
}
</style>