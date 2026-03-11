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
            :text="item.title" :link="item.link" />
    </div>
</template>

<style scoped>
.newsSidebar {
    flex: 0 0 auto;
    padding: 2rem;
}
</style>