<script setup>
import MarketTable from '../components/markets/MarketTable.vue'
import NewsFeedSidebar from '../components/newsFeed/NewsFeedSidebar.vue';
</script>

<template>
    <div class="tableFeed">
        <MarketTable />
        <NewsFeedSidebar />
    </div>
</template>

<style scoped>
.tableFeed {
    display: flex;
}
</style>
