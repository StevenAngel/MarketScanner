<script setup>
import MarketTable from './components/markets/MarketTable.vue'
import Navbar from './components/layout/Navbar.vue'
import NewsFeedSidebar from './components/newsFeed/NewsFeedSidebar.vue';
</script>

<template>
  <Navbar />
  <div class="tableFeed">
    <MarketTable />
    <NewsFeedSidebar />
  </div>
</template>

<style scoped></style>
