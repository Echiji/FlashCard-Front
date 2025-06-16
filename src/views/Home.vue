<script setup lang="ts">
<<<<<<< HEAD
import { useRouter } from 'vue-router';
import LessonCard from '../components/LessonCard.vue';
import { lessons } from '../data/LessonsStore';

const router = useRouter();
</script>

<template>
<div class="home">
  <h1 class="title">Welcome to Your Learning Journey</h1>
  <div class="lessons-grid">
    <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
  </div>
</div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 600;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .lessons-grid {
    grid-template-columns: 1fr;
  }
  
  .home {
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>
=======

</script>
<template>
<div>
  <h1>Home</h1>
</div>
</template>
>>>>>>> c3f321bb5155019cee0c2bbe86aa41defb81a566
