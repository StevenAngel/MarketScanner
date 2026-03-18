<script setup>
import { ref, computed } from 'vue';
const emit = defineEmits(['coinSelected', 'coinPercentSelected'])
const props = defineProps(['selectableCoins'])
const selectedCoins = ref([])
const searchQuery = ref('')
const showCoins = computed(() => {
    if (!searchQuery.value) {
        return props.selectableCoins
    } else {
        return props.selectableCoins.filter(coin => coin.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
})

// defineModel, for v-model bidirectional tunnel, no emits needed
// const selected = defineModel();

const searchCoin = (input) => {
    searchQuery.value = input.target.value
}

const coinSelected = (coin, value) => {
    const isChecked = value.target.checked
    emit("coinSelected", coin, isChecked)
    if (isChecked) {
        selectedCoins.value.push(coin)
    } else {
        const index = selectedCoins.value.indexOf(coin)
        selectedCoins.value.splice(index, 1)
    }
}

const coinPercentSelected = (coin, value) => {
    const percent = value.target.value
    emit("coinPercentSelected", coin, percent)
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
                    <input v-if="selectedCoins.includes(item)" class="percentInput" type="number" :value="item"
                        placeholder="% of portfolio" @change="coinPercentSelected(item, $event)" />
                </label>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.percentInput {
    width: 3rem;
    appearance: textfield;
}

.percentInput::-webkit-outer-spin-button,
.percentInput::-webkit-inner-spin-butto {
    -webkit-appearance: none;

}

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