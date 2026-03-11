<script setup>
const props = defineProps(['text'])
</script>

<template>
    <button class="button">
        <span>{{ props.text }}</span>
    </button>
</template>

<style scoped>
.button {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: .5rem 1rem;
    cursor: pointer;
    width: fit-content;
    border-radius: .5rem;
    font-size: inherit;
    font-style: inherit;
    color: inherit;
}

.button:hover {
    background-color: var(--border-subtle);
}
</style>