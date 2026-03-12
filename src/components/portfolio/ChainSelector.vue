<script setup>
import CustomButton from '../layout/CustomButton.vue';
import { ref } from 'vue';
const buttonText = ref('Select Chain')
const selectedChain = ref('eth')
const showDropdown = ref(false)
const selectChain = (value) => {
    selectedChain.value = value
    buttonText.value = value
}

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}
</script>

<template>
    <CustomButton :text="buttonText" @click="toggleDropdown" />
    <transition name="dropdown-slide">
        <div v-show="showDropdown" class="dropdown">
            <ul>
                <li>ETH</li>
                <li>BSC</li>
                <li>Arbitrum</li>
                <li>Base</li>
                <li>Solana</li>
                <li>Polygon</li>
                <li>Bitcoin</li>
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

ul {
    list-style-type: none;
    padding: 0;
    cursor: pointer;
    height: fit-content;
    overflow-y: auto;
}

li {
    padding: .5rem;
    border-radius: .5rem;
}

li:hover {
    background-color: var(--bg-surface);
}
</style>