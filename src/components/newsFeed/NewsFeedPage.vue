<script setup>
import { onMounted, ref } from 'vue';
import NewsItem from './NewsItem.vue';

const feed = ref([]);
// Backend needed
const loadFeed = async () => {
    feed.value = await fetch('http://localhost:3000/rss').then(res => res.json()).catch(err => console.error(err))
}

onMounted(loadFeed)
</script>

<template>
    <div class="newsFeed">
        <h2>News</h2>
        <div class="newsLayout">
            <NewsItem v-for="(item, index) in feed" :key="index" :imgSrc="item.imageUrl" :text="item.title"
                :link="item.link" />
        </div>
    </div>
</template>

<style scoped>
.newsFeed {
    padding: 2rem;
}

.newsLayout {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}
</style>