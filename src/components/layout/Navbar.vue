<script setup>
import Logo from '../../assets/branding/logo.png'
import WalletConnectButton from '../walletConnect/WalletConnectButton.vue';
import LightModeSwitch from './LightModeSwitch.vue';
import { ref } from 'vue';

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <div class="navbar">
        <div class="innerNavbar">
            <div class="menuToggleWrapper">
                <!-- router-link is vue element for <a> for loading new page without reloading whole site -->
                <router-link to="/" class="navbarItem"><img :src="Logo" class="logo" alt="Logo" /></router-link>
                <button class="menuToggle" @click="toggleMenu">
                    <span v-if="!isMenuOpen">☰</span>
                    <span v-else>✕</span>
                </button>
            </div>
            <div class="menuLinks" :class="{ 'isOpen': isMenuOpen }">
                <router-link to="/news" class="navbarItem">News</router-link>
                <router-link to="/portfolio" class="navbarItem">Portfolio</router-link>
                <div class="buttonsRight">
                    <LightModeSwitch />
                    <WalletConnectButton />
                </div>
            </div>
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
    user-select: none;
}

.innerNavbar {
    display: flex;
    gap: 1rem;
    padding: 1rem;
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

.buttonsRight {
    margin-left: auto;
    display: flex;
    align-items: inherit;
    gap: inherit;
}

.menuToggleWrapper {
    display: flex;
    justify-content: space-between;
}

.menuToggle {
    display: none;
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-primary);
    cursor: pointer;
}

.menuLinks {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
}

@media (max-width: 768px) {
    .menuToggleWrapper {
        width: 100%;
    }

    .menuToggle {
        display: block;
        /* Button anzeigen */
        margin-left: auto;
    }

    .logo {
        height: 3rem;
        /* Auf Desktop darf es groß sein */
    }

    .navbarItem {
        font-size: 1.5rem;

        /* Größere Schrift für Desktop */
    }

    .innerNavbar {
        gap: 1rem;
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
    }

    .buttonsRight {
        margin: 0;
        align-items: center;
    }

    .menuLinks {
        flex-direction: column;
        display: none;
    }

    .menuLinks.isOpen {
        display: flex;
    }
}
</style>