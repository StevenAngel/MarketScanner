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
        <h1>News</h1>
        <div class="categories">
            <NewsSortButton v-for="(item, index) in feed.allCategories" :key="index" :text="item"
                :class="{ highlighted: sortKey == item }" @click="sortNews(item)" />
        </div>
        <div class="newsLayout">
            <NewsItem v-for="(item, index) in filteredFeed" :key="index" :imgSrc="item.imageUrl" :text="item.title"
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
    justify-content: center;
    margin: 1rem;
}

.categories {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 1rem;
}

.highlighted {
    background-color: var(--border-subtle);
}
</style>