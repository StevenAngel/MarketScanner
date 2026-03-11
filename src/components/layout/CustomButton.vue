<script setup>
const props = defineProps(['text'])
</script>

<template>
    <div class="button">
        <span>{{ props.text }}</span>
    </div>
</template>

<style scoped>
.button {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    padding: .5rem 1rem;
    cursor: pointer;
    width: fit-content;
    border-radius: .5rem;
}

.button:hover {
    background-color: var(--border-subtle);
}
</style>