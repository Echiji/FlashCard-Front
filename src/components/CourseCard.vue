<template>
    <div class="course-card" @click="goToCourseLessons">
        <h3>{{ course.title }}</h3>
        <p>{{ course.typeCourse }}</p>
        <div class="course-actions">
            <button @click.stop="editCourse">Edit</button>
            <button @click.stop="deleteCourse">Delete</button>
        </div>
    </div>

</template>

<script setup lang="ts">
import CourseService from '@/services/CourseService';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

interface Course {
    id: number;
    title: string;
    typeCourse: string;
    user_id: number;
}

const props = defineProps<{
    course: Course;
}>();

// Émettre un événement pour informer le parent qu'on veut éditer ce cours
const emit = defineEmits<{
    editCourse: [course: Course]
}>();

const editCourse = () => {
    console.log('Édition du cours:', props.course);
    emit('editCourse', props.course);
};

const goToCourseLessons = () => {
    console.log('Navigation vers les leçons du cours:', props.course.id);
    router.push(`/courses/${props.course.id}`);
};

const deleteCourse = async () => {
    try {
        console.log('ID à supprimer:', props.course.id);
        console.log('Suppression du cours:', props.course);
        await CourseService.deleteCourse(props.course.id);
        console.log('Cours supprimé avec succès');
        // Optionnel: émettre un événement pour rafraîchir la liste
        // ou rediriger vers la page d'accueil
        window.location.reload();
    } catch (error) {
        console.error('Erreur lors de la suppression du cours:', error);
        alert('Erreur lors de la suppression du cours');
    }
}
</script>

<style scoped>
.course-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.course-card h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.course-card p {
    margin: 0 0 15px 0;
    color: #666;
}

.course-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.course-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.course-actions button:first-child {
    background-color: #007bff;
    color: white;
}

.course-actions button:first-child:hover {
    background-color: #0056b3;
}

.course-actions button:last-child {
    background-color: #dc3545;
    color: white;
}

.course-actions button:last-child:hover {
    background-color: #c82333;
}
</style>