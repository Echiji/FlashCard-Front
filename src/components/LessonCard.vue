<template>
    <div class="lesson-card" @click="router.push(`/lesson/${lesson.id}`)">
        <div class="lesson-content">
            <h2 class="lesson-title">{{ lesson.name }}</h2>
            <p class="lesson-description">{{ lesson.description }}</p>
            <div class="lesson-footer">
                <span class="lesson-number">Lesson {{ lesson.id }}</span>
                <span class="arrow">→</span>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps<{
    lesson: {
        id: number;
        name: string;
        description: string;
        questions: string[];
        answers: string[];
    };
}>();
</script>

<style scoped>
.lesson-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
    height: 100%;
}

.lesson-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.lesson-content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.lesson-title {
    color: #2c3e50;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    font-weight: 600;
}

.lesson-description {
    color: #666;
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
    flex-grow: 1;
}

.lesson-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.lesson-number {
    color: #666;
    font-size: 0.9rem;
}

.arrow {
    color: #3498db;
    font-size: 1.2rem;
    transition: transform 0.3s ease;
}

.lesson-card:hover .arrow {
    transform: translateX(5px);
}
</style>