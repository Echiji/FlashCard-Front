<template>
    <div class="lesson-card card" @click="GoInTheLesson">
        <div class="lesson-content">
            <h2 class="lesson-title title title-md">{{ lesson.title }}</h2>
            <p class="lesson-description">{{ lesson.description }}</p>
            <div class="lesson-footer">
                <div class="lesson-actions">
                    <button @click.stop="goToEditMode" class="btn btn-primary btn-sm">Créer une question</button>
                    <button @click.stop="deleteLesson" class="btn btn-secondary btn-sm">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import lessonService from '@/services/LessonService';
import { defineEmits } from 'vue';

const router = useRouter();
const emit = defineEmits(['deleted']);
const props = defineProps<{
    lesson: {
        id: number;
        title: string;
        description: string;
        questions: string[];
        answers: string[];
    };
}>();

const GoInTheLesson = () => {
    router.push(`/lessons/${props.lesson.id}`);
}

const goToEditMode = () => {
    // Détecter d'où on vient en regardant l'URL actuelle
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/course/') && currentPath.includes('/lessons')) {
        // On vient de CourseLessons
        router.push(`/create-lesson/${props.lesson.id}?from=course-lessons`);
    } else {
        // On vient de Home
        router.push(`/create-lesson/${props.lesson.id}?from=home`);
    }
}   
const deleteLesson = async () => {
    await lessonService.deleteLesson(props.lesson.id);
    emit('deleted', props.lesson.id);
}
</script>

<style scoped>
.lesson-card {
    transition: all var(--transition-normal);
    cursor: pointer;
    overflow: hidden;
    height: 100%;
    border: 1px solid var(--border-color);
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
}

.lesson-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.lesson-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--spacing-lg);
}

.lesson-title {
    margin-bottom: var(--spacing-md);
    font-weight: 600;
    color: var(--secondary-color);
    font-size: var(--font-size-xl);
    line-height: 1.3;
}

.lesson-description {
    color: var(--gray);
    font-size: var(--font-size-base);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
    flex-grow: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.lesson-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--border-color);
}

.lesson-actions {
    display: flex;
    gap: var(--spacing-sm);
    width: 100%;
}

.btn-sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-sm);
    min-height: 36px;
}

/* Media queries */
@media (max-width: 768px) {
    .lesson-content {
        padding: var(--spacing-md);
    }

    .lesson-title {
        font-size: var(--font-size-lg);
    }

    .lesson-description {
        font-size: var(--font-size-sm);
        -webkit-line-clamp: 2;
    }

    .lesson-actions {
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .btn-sm {
        width: 100%;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .lesson-content {
        padding: var(--spacing-sm);
    }

    .lesson-title {
        font-size: var(--font-size-base);
        margin-bottom: var(--spacing-sm);
    }

    .lesson-description {
        margin-bottom: var(--spacing-md);
    }

    .lesson-footer {
        padding-top: var(--spacing-sm);
    }
}

@media (min-width: 1024px) {
    .lesson-card {
        min-height: 200px;
    }
}
</style>