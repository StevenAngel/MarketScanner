<script setup>
const props = defineProps(['imgSrc', 'text', 'link'])

const openNewsLink = () => {
    window.open(props.link)
}
</script>

<template>
    <div class="newsItem" @click="openNewsLink()">
        <img :src="props.imgSrc" />
        <p class="itemText">{{ props.text }}</p>
    </div>
</template>

<style scoped>
.newsItem {
    background-color: var(--bg-surface);
    width: 20rem;
    height: fit-content;
    border-radius: 1rem;
    margin-top: 1rem;
    cursor: pointer;
}

.newsItem:hover {
    background-color: var(--border-subtle);
}

.newsItem img {
    width: 100%;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.itemText {
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 10px;
    padding-right: 10px;
}
</style>