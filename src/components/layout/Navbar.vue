<script setup>
import Logo from '../../assets/branding/logo.png'
</script>

<template>
    <div class="navbar">
        <div class="innerNavbar">
            <img :src="Logo" class="logo" />
            <div class="navbarItem">Markets</div>
            <div class="navbarItem">News</div>
            <div class="web3Login">Connect Wallet</div>
        </div>
    </div>
</template>

<style scoped>
.navbar {
    width: 100%;
    background: linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%);
    color: var(--text-primary);
    padding: 0.1rem;
    position: sticky;
    top: 0;
    z-index: 100;
}

.innerNavbar {
    display: flex;
    gap: 1rem;
    margin: 1rem;
    align-items: center;
}

.logo {
    height: 5rem;
}

.web3Login {
    margin-left: auto;
}
</style>