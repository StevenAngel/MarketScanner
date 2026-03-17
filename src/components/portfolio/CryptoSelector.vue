<script setup>
import { ref } from 'vue';
const emit = defineEmits(['coinSelected'])
const props = defineProps(['selectableCoins'])
const showCoins = ref(props.selectableCoins)
const showDropdown = ref(false)
// defineModel, for v-model bidirectional tunnel, no emits needed
// const selected = defineModel();
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const searchCoin = (input) => {
    const search = input.target.value
    if (search != '') {
        showCoins.value = props.selectableCoins.filter(coin => coin.toLowerCase().includes(search.toLowerCase()))
    } else {
        showCoins.value = props.selectableCoins
    }
}

const coinSelected = (coin, value) => {
    const isChecked = value.target.checked
    emit("coinSelected", coin, isChecked)
}
</script>

<template>
    <div class="listWrapper">
        <input class="coinSearch textInput" type="text" placeholder="Search for coins" @input="searchCoin" />
        <ul class="dropdownList">
            <li v-for="item of showCoins" :key="item" class="dropdownItem">
                <label class="innerItem">
                    <!-- v-model for bidirectional tunnel from parent to child and child to parent, only for inputs -->
                    <!-- <input type="checkbox" :value="item" v-model="selected" /> -->
                    <!-- use emit, because then i need no "watch" to start a function -->
                    <input type="checkbox" :value="item" @change="coinSelected(item, $event)" />
                    <span>{{ item }}</span>
                    <!-- <input type="number" :value="item" placeholder="% of portfolio" /> -->
                </label>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.textInput {
    height: 1rem;
    font-size: inherit;
    font-family: inherit;
}

.coinSearch {
    position: sticky;
    top: 0;
}

.listWrapper {
    border: 1px solid var(--text-secondary);
    border-radius: 1rem;
    padding: 0;
    height: 400px;
    width: fit-content;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    scrollbar-color: #444 #1a1a1a;
    /* Fade out tokens so the user knows he can scroll */
    mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.dropdownList {
    list-style-type: none;
    padding: 0;
}

.dropdownItem {
    border-radius: .5rem;
    width: 100%;
}

.dropdownItem:hover {
    background-color: var(--bg-surface);
}

.innerItem {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .75rem;
    cursor: pointer;
    /* line-height: 0, damit es zentriert aussieht */
    line-height: 0;
}

.iconWrapper {
    height: 25px;
    width: 25px;
}

.dropdownText {
    align-content: center;
}
</style>