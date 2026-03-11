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
    padding: .5rem;
    border-radius: .5rem;
    width: fit-content;
    cursor: pointer;
}

.sortButton:hover {
    background-color: var(--border-subtle);
}
</style>