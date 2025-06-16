<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
</script>

<template>
  <Header />
  <router-view></router-view>
  <Footer />
</template>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>

