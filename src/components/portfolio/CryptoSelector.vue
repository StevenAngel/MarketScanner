<script setup>
import { ref, watch } from 'vue';
import CustomButton from '../layout/CustomButton.vue';
const emit = defineEmits(['coinSelected'])
const props = defineProps(['selectableCoins'])
const showDropdown = ref(false)
// defineModel, for v-model bidirectional tunnel, no emits needed
// const selected = defineModel();
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const coinSelected = (coin, value) => {
    const isChecked = value.target.checked
    emit("coinSelected", coin, isChecked)
}
</script>

<template>
    <div>
        <CustomButton class="button" text="coins" @click="toggleDropdown()" />
        <div v-show="!showDropdown" class="dropdown">
            <ul class="dropdownList">
                <li v-for="item of props.selectableCoins" :key="item" class="dropdownItem">
                    <label class="innerItem">
                        <!-- v-model for bidirectional tunnel from parent to child and child to parent, only for inputs -->
                        <!-- <input type="checkbox" :value="item" v-model="selected" /> -->
                        <!-- use emit, because then i need no "watch" to start a function -->
                        <input type="checkbox" :value="item" @change="coinSelected(item, $event)" />
                        <span>{{ item }}</span>
                    </label>
                </li>
            </ul>
        </div>
    </div>
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
    background-color: var(--bg-main);
    user-select: none;
}

.dropdownList {
    list-style-type: none;
    padding: 0;
    height: fit-content;
    overflow: auto;
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