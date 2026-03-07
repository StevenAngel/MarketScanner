<script setup>
import MarketsContainer from './components/markets/MarketsTable.vue'
import Navbar from './components/layout/Navbar.vue'
</script>

<template>
  <Navbar />
  <MarketsContainer />
</template>

<style scoped></style>

<style>
h1 {
  font-size: 2rem;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  text-align: center;
}

td,
th {
  padding: 1rem;
}
</style>
