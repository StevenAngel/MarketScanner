<script setup>
const props = defineProps(['text'])
</script>

<template>
    <div class="sortButton">
        <span>{{ props.text }}</span>
    </div>
</template>

<style scoped>
.sortButton {
    background-color: var(--bg-surface);
    padding: 1rem;
    border-radius: 1rem;
}

.sortButton:hover {
    background-color: var(--border-subtle);
}
</style>