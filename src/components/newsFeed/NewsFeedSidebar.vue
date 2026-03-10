<script setup>
import { onMounted, ref } from 'vue';
import NewsItem from './NewsItem.vue';

let feed = ref([]);
// Backend needed
const loadFeed = async () => {
    feed.value = await fetch('http://localhost:3000/rss').then(res => res.json()).catch(err => console.error(err))
}

onMounted(loadFeed)
</script>

<template>
    <div class="newsSidebar">
        <h2>News Feed</h2>
        <NewsItem v-for="item in feed" :imgSrc="item['bnmedia:post-thumbnail']['bnmedia:url']" :text="item.title" />
    </div>
</template>

<style scoped>
.newsSidebar {
    flex: 0 0 auto;
}
</style>