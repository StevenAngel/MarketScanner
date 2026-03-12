<script setup>
import { ref } from 'vue';
const buttonText = ref('Select Chain')
const showDropdown = ref(false)
const chains = [{
    id: "eth",
    name: "Ethereum",
    logo: "https://moralis.com/wp-content/uploads/2025/10/ethereum-icon-gray.svg"
},
{
    id: "bsc",
    name: "BSC",
    logo: "https://moralis.com/wp-content/uploads/2024/06/BNB-Logo.svg"
},
{
    id: "sol",
    name: "Solana",
    logo: "https://moralis.com/wp-content/uploads/2022/12/Solana.svg"
},
{
    id: "arb",
    name: "Arbitrum",
    logo: "https://moralis.com/wp-content/uploads/2025/01/Arbitrum-Logo.svg"
},
{
    id: "pol",
    name: "Polygon",
    logo: "https://moralis.com/wp-content/uploads/2024/05/Polygon.svg"
},
{
    id: "base",
    name: "Base",
    logo: "https://moralis.com/wp-content/uploads/2022/12/Base-Logo-Blue.svg"
},
{
    id: "btc",
    name: "Bitcoin",
    logo: "https://moralis.com/wp-content/uploads/2026/01/bitcoin-icon.svg"
}]

const selectedChain = ref(chains[0])

const selectChain = (value) => {
    selectedChain.value = chains.find(obj => obj.id == value)
    buttonText.value = value
    showDropdown.value = !showDropdown.value
}

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}
</script>

<template>
    <button class="button" @click="toggleDropdown()">
        <div class="iconWrapper">
            <img :src="selectedChain.logo" :alt="selectedChain.name + ' Logo'" class="icon" />
        </div>
        <span class="dropdownText">
            {{ selectedChain.name }}
        </span>
    </button>
    <transition name="dropdown-slide">
        <div v-show="showDropdown" class="dropdown">
            <ul class="dropdownList">
                <li v-for="item in chains" class="dropdownItem" @click="selectChain(item.id)">
                    <div class="iconWrapper">
                        <img :src="item.logo" :alt="item.name + ' Logo'" class="icon" />
                    </div>
                    <span class="dropdownText">
                        {{ item.name }}
                    </span>
                </li>
            </ul>
        </div>
    </transition>
</template>

<style scoped>
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
    transition: all 0.3s ease;
}

/* Start- und Endzustand der Animation */
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
    opacity: 0;
    /* transform: translateY(-10px); */
}

.dropdown {
    z-index: 99;
    position: absolute;
    border: 1px solid var(--text-primary);
    border-radius: .5rem;
}

.dropdownList {
    list-style-type: none;
    padding: 0;
    cursor: pointer;
    height: fit-content;
    overflow-y: auto;
}

.dropdownItem {
    padding: .5rem;
    border-radius: .5rem;
    display: flex;
    justify-items: center;
    gap: .5rem;
}

.dropdownItem:hover {
    background-color: var(--bg-surface);
}

.iconWrapper {
    height: 25px;
    width: 25px;
}

.icon {
    height: 100%;
    width: 100%;
    object-fit: contain;
}

.dropdownText {
    align-content: center;
}

.button {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: .5rem;
    cursor: pointer;
    width: fit-content;
    border-radius: .5rem;
    font-size: inherit;
    font-style: inherit;
    color: inherit;
    font-weight: inherit;
    display: flex;
    gap: .5rem;
}

.button:hover {
    background-color: var(--border-subtle);
}
</style>