<script setup>
const props = defineProps(['imgSrc', 'text', 'link', 'author', 'publishDate', 'content'])
const publishDate = new Date(props.publishDate).toLocaleDateString()
const openNewsLink = () => {
    window.open(props.link)
}
</script>

<template>
    <div class="newsItem" @click="openNewsLink()">
        <img :src="props.imgSrc" />
        <div>
            <p class="itemText">{{ props.text }}</p>
            <p class="preview">{{ props.content }}</p>
        </div>
        <div class="itemInfos">
            <span class="subtext">{{ props.author }}</span>
            <span class="subtext">{{ publishDate }}</span>
        </div>
    </div>
</template>

<style scoped>
.newsItem {
    background-color: var(--bg-surface);
    /* Wichtig für das Stretch-Verhalten, damit alle cards gleich hoch werden */
    height: 100%;
    border-radius: 1rem;
    margin-top: 1rem;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
}

.newsItem:hover {
    background-color: var(--border-subtle);
}

/* .newsItem:first-child {
    grid-column: span 2;
    grid-row: span 2;
}

*/
/* .newsItem:first-child img {
    height: fit-content
} */

.newsItem:nth-child(5n) {
    grid-column: span 2;
    /* grid-row: span 2; */

}

.newsItem img {
    width: 100%;
    /* flex-grow = bild streched die height, damit die card, falls sie leer erscheinen würde voll ist mit dem bild */
    /* flex-grow: 1; */
    height: 300px;
    min-height: 0;
    /* Verhindert Verzerrung */
    object-fit: cover;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.itemText {
    margin: 5px 10px 5px 10px;
}

.preview {
    font-size: 12px;
    margin: 5px 10px 5px 10px;
    color: var(--text-secondary)
}

.subtext {
    color: var(--text-secondary);
}

.itemInfos {
    /* Schiebt Autor/Datum nach ganz unten */
    margin: auto 10px 5px 10px;
    display: flex;
    justify-content: space-between;
}
</style>