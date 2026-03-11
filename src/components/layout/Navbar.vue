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

.logo {
    height: 5rem;
}

.web3Login {
    margin-left: auto;
}
</style>