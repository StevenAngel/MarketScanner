<script setup>
const props = defineProps(['imgSrc', 'text'])
console.log(props.text)
</script>

<template>
    <div class="newsItem">
        <img :src="props.imgSrc" />
        <p>{{ props.text }}</p>
    </div>
</template>

<style scoped>
.newsItem {
    background-color: var(--bg-surface);
    width: 20em;
    height: inherit;
    border-radius: 1em;
    margin-top: 1em;
    cursor: pointer;
}

.newsItem:hover {
    background-color: var(--border-subtle);
}

.newsItem img {
    width: 100%;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
}
</style>