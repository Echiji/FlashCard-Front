<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LessonCard from '../components/LessonCard.vue';
import Modal from '../components/Modal.vue';
import { ref } from 'vue';
import lessonService from '@/services/LessonService';

const router = useRouter();
const newLesson = ref({
  title: '',
  description: ''
});
const lessons = ref<Lesson[]>([]);
const isModalOpen = ref(false)

onMounted(() => {
  console.log('Home component mounted');
  console.log('Lessons:', lessons);
  getLessons();

});



const addLesson = async () => {
  const lessonCreated = await lessonService.createLesson(newLesson.value);
  lessons.value.push(lessonCreated);
  console.log('Lessons:', lessons);
  isModalOpen.value = false;
  newLesson.value = {
    title: '',
    description: ''
  };
};

const getLessons = async () => {
  lessons.value = await lessonService.getLessons();
};

const handleLessonDeleted = (id: number) => {
  lessons.value = lessons.value.filter(l => l.id !== id);
};
</script>

<template>
  <div class="home container">
    <div class="home-header">
      <h1 class="title title-xl">Welcome to Your Learning Journey</h1>
      <button class="btn btn-primary" @click="isModalOpen = true">
        <span class="icon">+</span>
        Ajouter une leçon
      </button>
    </div>
    <div class="lessons-grid">
      <LessonCard
        v-for="lesson in lessons"
        :key="lesson.id"
        :lesson="lesson"
        @deleted="handleLessonDeleted"
      />
    </div>
  </div>
  <Modal :isOpen="isModalOpen" title="Ajouter une leçon" @close="isModalOpen = false">
    <div class="modal-form">
      <div class="form-group">
        <input 
          type="text" 
          v-model="newLesson.title" 
          placeholder="Titre de la leçon" 
          class="input"
        />
      </div>
      <div class="form-group">
        <input 
          type="text" 
          v-model="newLesson.description" 
          placeholder="Description de la leçon" 
          class="input"
        />
      </div>
    </div>
    <template #footer>
      <button class="btn btn-primary" @click="addLesson">Ajouter</button>
    </template>
  </Modal>
</template>

<style scoped>
.home {
  padding: var(--spacing-xl) 0;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
  gap: var(--spacing-lg);
}

.home-header .title {
  margin-bottom: 0;
  flex: 1;
  color: var(--secondary-color);
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.icon {
  font-size: var(--font-size-lg);
  font-weight: bold;
  margin-right: var(--spacing-xs);
}

/* Media queries */
@media (max-width: 1024px) {
  .lessons-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .home {
    padding: var(--spacing-lg) 0;
  }
  
  .home-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: var(--spacing-md);
  }
  
  .lessons-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .title-xl {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .home {
    padding: var(--spacing-md) 0;
  }
  
  .home-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .title-xl {
    font-size: var(--font-size-xl);
  }
  
  .lessons-grid {
    gap: var(--spacing-sm);
  }
}

@media (min-width: 1200px) {
  .lessons-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}
</style>
