<script setup>
const props = defineProps(['imgSrc', 'text', 'link', 'author', 'publishDate', 'content'])
const publishDate = new Date(props.publishDate).toLocaleDateString()
const openNewsLink = () => {
    window.open(props.link)
}
</script>

<template>
    <div class="item" @click="openNewsLink()">
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
.item img {
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
    margin-top: auto;
    padding: 0 10px 5px 10px;
    display: flex;
    justify-content: space-between;
}
</style>