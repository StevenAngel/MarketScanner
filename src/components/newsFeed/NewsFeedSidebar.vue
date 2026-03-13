<script setup>
import { onMounted, ref } from 'vue';
import NewsItem from './NewsItem.vue';

const feed = ref([]);

// Load rss news feed from backend
const loadFeed = async () => {
    feed.value = await fetch('http://localhost:3000/rss').then(res => res.json()).catch(err => console.error(err))
}

onMounted(loadFeed)
</script>

<template>
    <div class="newsSidebar">
        <h2>News Feed</h2>
        <NewsItem v-for="(item, index) in feed.news?.slice(0, 20)" :key="index" :imgSrc="item.imageUrl"
            :text="item.title" :author="item.author" :content="item.content" :publishDate="item.date" :link="item.link"
            class="newsItem" />
        <!-- <NewsItem v-for="(item, index) in feed.news?.slice(0, 20)" :key="index" :imgSrc="item.imageUrl"
            :text="item.title" :link="item.link" class="newsItem" /> -->
    </div>
</template>

<style scoped>
.newsSidebar {
    flex: 0 0 auto;
    padding: 2rem;
}

.newsItem {
    background-color: var(--bg-surface);
    width: 20rem;
    height: fit-content;
    border-radius: 1rem;
    margin-top: 1rem;
    cursor: pointer;
}

.newsItem :deep(img) {
    height: 200px;
}

.newsItem:hover {
    background-color: var(--border-subtle);
}
</style>