<template>
    <div class="container">
        <div class="container-header">
            <div class="course-info">
                <h1>{{ course.title }}</h1>
                <span>{{ course.typeCourse }}</span>
            </div>
            <button @click="openModal">Créer une leçon</button>
        </div>
        
        <div class="container-body">
            <div class="lessons-grid">
                <div v-for="lesson in lessons" :key="lesson.id" class="lesson-card" @click="goToLesson(lesson.id)">
                    <div class="lesson-content">
                        <h2 class="lesson-title">{{ lesson.title }}</h2>
                        <p class="lesson-description" ></p>
                        <div class="lesson-footer">
                            <div class="lesson-actions">
                                <button @click.stop="goToCreateQuestions(lesson.id)" class="questions-btn">Questions</button>
                                <button @click.stop="deleteLesson(lesson.id)" class="delete-btn">Supprimer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal pour créer/modifier une leçon -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <h2>{{ isEditing ? 'Modifier une leçon :' : 'Ajouter une leçon :' }}</h2>
            <form @submit.prevent="saveLesson">
                <div class="form-group">
                    <label for="title">Titre</label>
                    <input type="text" v-model="newLesson.title" id="title" required />
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea v-model="newLesson.description" id="description" required></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" @click="closeModal" class="cancel-btn">Annuler</button>
                    <button type="submit" class="save-btn">{{ isEditing ? 'Modifier' : 'Créer' }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CourseService from '@/services/CourseService';
import { Lesson } from '@/services/LessonService';
import lessonService from '@/services/LessonService';


const route = useRoute();
const router = useRouter();

interface Course {
    id: number;
    title: string;
    typeCourse: string;
}

const course = ref<Course>({
    id: 0,
    title: '',
    typeCourse: ''
});
const lessons = ref<Lesson[]>([]);
const showModal = ref(false);
const isEditing = ref(false);
const editingLesson = ref<Lesson | null>(null);
const newLesson = ref<Lesson>({
    title: '',
    description: ''
});

onMounted(async () => {
    try {
        const courseId = parseInt(route.params.id as string);
        
        // Récupérer les informations du cours
        const courseData = await CourseService.getCourseById(courseId);
        course.value = courseData;
        
        // Récupérer les leçons du cours
        await loadLessons(courseId);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur lors du chargement du cours');
    }
});

const loadLessons = async (courseId: number) => {
    try {
        // Récupérer toutes les leçons et filtrer par cours
        const allLessons = await lessonService.getAllLessons();
        console.log('Toutes les leçons récupérées:', allLessons);
        
        // Filtrer les leçons qui appartiennent à ce cours
        const filteredLessons = allLessons.filter(lesson => lesson.courseId === courseId);
        console.log('Leçons filtrées pour ce cours:', filteredLessons);
        lessons.value = filteredLessons;
    } catch (error) {
        console.error('Erreur lors du chargement des leçons:', error);
        lessons.value = [];
    }
};

const openModal = () => {
    showModal.value = true;
    isEditing.value = false;
    editingLesson.value = null;
    resetForm();
};

const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
    editingLesson.value = null;
    resetForm();
};

const resetForm = () => {
    newLesson.value = {
        title: '',
        description: ''
    };
};

const saveLesson = async () => {
    try {
        
        if (isEditing.value && editingLesson.value) {
            // Modification d'une leçon existante
            const updatedLesson = await lessonService.updateLesson(editingLesson.value.id!, newLesson.value);
            const index = lessons.value.findIndex(l => l.id === editingLesson.value!.id);
            if (index !== -1) {
                lessons.value[index] = updatedLesson;
            }
        } else {
            // Création d'une nouvelle leçon associée au cours
            const courseId = parseInt(route.params.id as string);
            const createdLesson = await lessonService.createLessonWithCourse(courseId, newLesson.value);
            // Recharger toutes les leçons pour s'assurer qu'elles sont bien associées au cours
            await loadLessons(courseId);
        }
        closeModal();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde de la leçon');
    }
};

const editLesson = (lesson: Lesson) => {
    isEditing.value = true;
    editingLesson.value = lesson;
    newLesson.value = {
        title: lesson.title,
        description: lesson.description
    };
    showModal.value = true;
};

const deleteLesson = async (lessonId: number) => {
    try {
        await lessonService.deleteLesson(lessonId);
        lessons.value = lessons.value.filter(l => l.id !== lessonId);
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la leçon');
    }
};

const goToLesson = (lessonId: number) => {
    router.push(`/lesson-content/${lessonId}`);
};

const goToCreateQuestions = (lessonId: number) => {
    router.push(`/questionnaire-gestion/lessons/${lessonId}`);
};
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100vh;
    background-color: var(--background-color);
    padding: var(--spacing-lg);
}

.container-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: var(--spacing-md);
}

.course-info h1 {
    margin: 0;
    font-size: var(--font-size-2xl);
    color: var(--secondary-color);
    font-weight: 600;
}

.course-info span {
    font-size: var(--font-size-base);
    color: var(--gray);
    display: block;
    margin-top: var(--spacing-xs);
}

.container-header button {
    padding: var(--spacing-sm) var(--spacing-lg);
    background-color: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: background-color var(--transition-normal);
    white-space: nowrap;
}

.container-header button:hover {
    background-color: var(--primary-hover);
}

.lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--spacing-lg);
}

.lesson-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    transition: all var(--transition-normal);
    cursor: pointer;
    height: 100%;
}

.lesson-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.lesson-content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.lesson-title {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--secondary-color);
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

.edit-btn, .delete-btn, .questions-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: all var(--transition-normal);
    min-height: 36px;
    flex: 1;
}

.edit-btn {
    background: var(--primary-color);
    color: var(--white);
}

.edit-btn:hover {
    background: var(--primary-hover);
}

.questions-btn {
    background: #28a745;
    color: var(--white);
}

.questions-btn:hover {
    background: #218838;
}

.delete-btn {
    background: var(--accent-color);
    color: var(--white);
}

.delete-btn:hover {
    background: #c0392b;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: var(--spacing-md);
}

.modal-content {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
}

.modal-content h2 {
    margin: 0 0 var(--spacing-lg) 0;
    color: var(--secondary-color);
    font-size: var(--font-size-xl);
    font-weight: 600;
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--secondary-color);
    font-size: var(--font-size-base);
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    background-color: var(--white);
    transition: border-color var(--transition-normal);
    min-height: 44px;
    box-sizing: border-box;
}

.form-group textarea {
    min-height: 100px;
    resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
    flex-wrap: wrap;
}

.cancel-btn, .save-btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: all var(--transition-normal);
    min-height: 44px;
}

.cancel-btn {
    background: var(--gray);
    color: var(--white);
}

.cancel-btn:hover {
    background: #5a6268;
}

.save-btn {
    background: #4CAF50;
    color: var(--white);
}

.save-btn:hover {
    background: #45a049;
}

/* Media queries */
@media (max-width: 768px) {
    .container {
        padding: var(--spacing-md);
    }

    .container-header {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    .course-info h1 {
        font-size: var(--font-size-xl);
    }

    .lessons-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .lesson-actions {
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .edit-btn, .delete-btn, .questions-btn {
        width: 100%;
    }

    .modal-overlay {
        padding: var(--spacing-sm);
    }

    .modal-content {
        padding: var(--spacing-lg);
        max-width: 100%;
    }

    .modal-actions {
        justify-content: center;
    }

    .cancel-btn, .save-btn {
        width: 100%;
        max-width: 200px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: var(--spacing-sm);
    }

    .container-header {
        padding: var(--spacing-md);
    }

    .course-info h1 {
        font-size: var(--font-size-lg);
    }

    .lesson-card {
        padding: var(--spacing-md);
    }

    .lesson-title {
        font-size: var(--font-size-lg);
    }

    .modal-content {
        padding: var(--spacing-md);
    }

    .modal-content h2 {
        font-size: var(--font-size-lg);
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1400px;
    }

    .modal-content {
        max-width: 700px;
    }
}
</style> 