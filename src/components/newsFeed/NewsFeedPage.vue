<script setup>
import { onMounted, ref, computed } from 'vue';
import NewsItem from './NewsItem.vue';
import NewsSortButton from './NewsSortButton.vue';

const feed = ref({});
const sortKey = ref('')
const filteredFeed = computed(() => {
    if (feed.value.news) {
        const filtered = []
        feed.value.news.forEach(element => {
            if (element.categories.includes(sortKey.value) || sortKey.value == '') {
                filtered.push(element)
                console.log(element.date)
            }
        })
        return filtered;
    }
})

// Load rss news feed from backend
const loadFeed = async () => {
    feed.value = await fetch('http://localhost:3000/rss').then(res => res.json()).catch(err => console.error(err))
}

// Sort news
const sortNews = (category) => {
    if (sortKey.value != category) {
        sortKey.value = category
    } else {
        sortKey.value = ''
    }
}

onMounted(loadFeed)
</script>

<template>
    <div class="newsFeed">
        <div class="categories">
            <h1>News</h1>
            <NewsSortButton v-for="(item, index) in feed.allCategories" :key="index" :text="item"
                :class="{ highlighted: sortKey == item }" @click="sortNews(item)" />
        </div>
        <div class="newsLayout">
            <NewsItem v-for="(item, index) in filteredFeed" :key="index" :imgSrc="item.imageUrl" :text="item.title"
                :author="item.author" :content="item.content" :publishDate="item.date" :link="item.link"
                class="newsItem" />
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

/* Die Hero-Card ganz am Anfang */
.newsItem:first-child {
    grid-column: span 2;
}

/* Spezifisch das 2. Item */
.newsItem:nth-child(2) {
    grid-column: span 2;
}

/* Ab der 7. Card jede 5. */
.newsItem:nth-child(5n + 7) {
    grid-column: span 2;
}

.newsFeed {
    padding: 2rem;
}

.newsLayout {
    display: grid;
    /* 
        grid-template-colums: bestimme colums
        repeat: wiederhole so oft wie nötig, auto-fill: berechnet, wie viele Spalten mit der Mindestbreite (20rem) in den Container passen, wenn container 60rem breit -> auto 3 spalten
        minmax: minimal 20rem pro spalte, max 1fr = wenn platz übrig ist (z.b. container = 50rem) pro spalte aber nur 20rem belegt, teilen sich die 2 spalten den restplatz und werden 25rem pro spalte
    */
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    /* Width 90rem, damit nur 4 karten angezeigt werden pro column */
    width: 90rem;
    /* Alle Karten in einer Zeile werden gleich hoch */
    align-items: stretch;
    /* Passt kleinere karten in lücken die durch große karten entstehen */
    /* grid-auto-flow: dense; */
    gap: 1rem;
    margin: 1rem auto;
}

.categories {
    position: sticky;
    top: 0;
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    /* width: fit-content; */
    padding: 1rem;
    background-color: var(--bg-main);
    border-bottom: 1px solid var(--border-subtle);
    /* border-radius: 1rem; */
    margin: auto;
}

.highlighted {
    background-color: var(--border-subtle);
}
</style>