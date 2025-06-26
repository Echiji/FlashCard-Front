<template>
<div class="container">
    <div class="container-header">
        <div class="header-left">
            <button @click="goBack" class="back-btn">
                <span class="back-icon">←</span>
                Retour
            </button>
            <div class="Info-leçon">
                <h1>{{ lesson.title }}</h1>
                <span>{{ lesson.description }}</span>
            </div>
        </div>
        <div class="header-right">
            <button @click="openModal">Créer une question</button>
            <button @click="launchLesson" class="launch-btn">Lancer la leçon</button>
        </div>
    </div>
    <div class="container-body">
        <div class="questions-list">
            <div v-for="(question, index) in lesson.questions" :key="index" class="question-card">
                <div class="question-header">
                    <p class="question-title">{{ question.question }}</p>
                    <div class="question-actions">
                        <button @click="editQuestion(index)" class="edit-btn">Modifier</button>
                        <button @click="deleteQuestion(index)" class="delete-btn">Supprimer</button>
                    </div>
                </div>
                <div v-if="question.type === 'multiple'">
                    <div v-for="(possibility, pIndex) in question.possibilities" :key="pIndex">
                        <input type="radio" :checked="possibility === question.answer" disabled>
                        <span class="possibility-text">{{ possibility.value }}</span>
                    </div>
                </div>
                <div v-else>
                    <p>Réponse: {{ question.answer }}</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal pour créer une question --> 
<div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
        <h2>{{ isEditing ? 'Modifier une question :' : 'Ajouter une question :' }}</h2>
        <form @submit.prevent="saveQuestion">
            <div class="form-group">
                <label id="type-question">Type de question</label>
                <div class="type-selector">
                    <div class="type-option">
                        <label>Choix multiples</label>
                        <input type="radio" v-model="selectedType" value="multiple">
                    </div>
                    <div class="type-option">
                        <label>Réponse libre</label>
                        <input type="radio" v-model="selectedType" value="text">
                    </div>
                </div>
            </div>

            <div class="form-group">
                <input type="text" v-model="newQuestion.question" placeholder="Question" required>
            </div>

            <div v-if="selectedType === 'multiple'" class="form-group">
                <label id="options">Options :</label>
                <div v-for="(option, index) in newQuestion.possibilities" :key="index" class="option-input">
                    <input type="text" v-model="option.value" :placeholder="`Option ${index + 1}`" required>
                    <button type="button" @click="removeOption(index)" class="remove-btn">×</button>
                </div>
                <button type="button" @click="addOption" class="add-option-btn">+ Ajouter une option</button>
            </div>

            <div class="form-group">
                <label id="reponse-correcte">Réponse correcte</label>
                <div v-if="selectedType === 'multiple'">
                    <select v-model="newQuestion.answer" required>
                        <option v-for="option in newQuestion.possibilities" :key="option.value" :value="option.value">
                            {{ option.value }}
                        </option>
                    </select>
                </div>
                <input v-else type="text" v-model="newQuestion.answer" required>
            </div>

            <div class="modal-actions">
                <button type="button" @click="closeModal" class="cancel-btn">Annuler</button>
                <button type="submit" class="save-btn">Enregistrer</button>
            </div>
        </form>
    </div>
</div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import lessonService from '@/services/LessonService';
import { Lesson } from '@/services/LessonService';
import questionService from '@/services/QuestionService';
import { Question } from '@/services/QuestionService';
import axios from 'axios';
import { API_URL } from '@/services/api';
import axiosInstance from '@/services/axiosInstance'; 
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const token = ref(authStore.token); 
const lesson = ref({});                         
const showModal = ref(false);
const isEditing = ref(false);
const editingIndex = ref(-1);
const selectedType = ref<'multiple' | 'text'>('multiple');
const newQuestion = ref({
    lesson: lesson.value,
    question: '',
    type: 'multiple',
    answer: '',
    possibilities: [{
        value: ''
    }, 
    {
        value: ''
    }, 
    {
        value: ''
    }]
});

// Détecter d'où l'utilisateur vient
const getPreviousPage = () => {
    // Utiliser l'historique de navigation pour détecter la page précédente
    const historyLength = window.history.length;
    const currentPath = window.location.pathname;
    
    console.log('Current path:', currentPath);
    console.log('History length:', historyLength);
    
    // Si on a un paramètre de route indiquant qu'on vient de CourseLessons
    if (route.query.from === 'course-lessons') {
        return 'course-lessons';
    }
    
    // Si on a un paramètre de route indiquant qu'on vient de Home
    if (route.query.from === 'home') {
        return 'home';
    }
    
    // Si on a un paramètre de route indiquant qu'on vient de Courses
    if (route.query.from === 'courses') {
        return 'courses';
    }
    
    // Par défaut, essayer de détecter via le referrer (moins fiable)
    const referrer = document.referrer;
    console.log('Referrer:', referrer);
    
    // Si on vient de CourseLessons (contient /course/ et /lessons)
    if (referrer.includes('/courses/') && referrer.includes('/lessons')) {
        return 'course-lessons';
    }
    
    // Si on vient de la page des cours
    if (referrer.includes('/courses') && !referrer.includes('/lessons')) {
        return 'courses';
    }
    
    // Par défaut, retourner à Home
    return 'home';
};

onMounted(async () => {
    const lessonId = parseInt(route.params.id as string);
    const lessonData = await lessonService.getLessonById(lessonId);
     
    // Il n'y a pas de méthode getQuestionsByLesson dans le service de questions
    // Je vais donc supposer qu'il faut les récupérer via la leçon elle-même
    // ou qu'une autre méthode existe. Pour l'instant, je m'assure que `questions` est un tableau.
    if (!lessonData.questions) {
        lessonData.questions = [];
    }
    
    // Récupérer les questions de la leçon
    const questions = await questionService.getQuestionsByLesson(lessonData);
    lessonData.questions = questions;
    
    lesson.value = lessonData;
});

const addOption = () => {
    newQuestion.value.possibilities.push({
        value: ''
    });
};

const removeOption = (index: number) => {
    if (newQuestion.value.possibilities.length > 1) {
        newQuestion.value.possibilities.splice(index, 1);
    }
};

const saveQuestion = async () => {
    newQuestion.value.type = selectedType.value;
    
    if (isEditing.value) {
        // Modification d'une question existante
        lesson.value.questions[editingIndex.value] = { ...newQuestion.value };
        isEditing.value = false;
        editingIndex.value = -1;
    } else {
        // Création d'une nouvelle question
        console.log(newQuestion.value);
        newQuestion.value.lesson = lesson.value;
        const question = await questionService.createQuestion(newQuestion.value);
        lesson.value.questions.push(question);
    }
    
    closeModal();
};

const resetForm = () => {
    newQuestion.value = {
        lesson: lesson.value,
        question: '',
        type: 'multiple',
        answer: '',
        possibilities: [{
            value: ''
        }, 
        {
            value: ''
        }, 
        {
            value: ''
        }]
    };
    selectedType.value = 'multiple';
};

const editQuestion = (index: number) => {
    const question = lesson.value.questions[index];
    isEditing.value = true;
    editingIndex.value = index;
    selectedType.value = question.type;
    newQuestion.value = {
        id: question.id,
        question: question.question,
        type: question.type,
        answer: question.answer,
        possibilities: question.type === 'multiple' ? [...question.possibilities] : [{
            value: ''
        }, 
        {
            value: ''
        }, 
        {
            value: ''
        }]
    };
    showModal.value = true;
};

const deleteQuestion = async (index: number) => {
    await questionService.deleteQuestion(lesson.value.questions[index].id);
    lesson.value.questions.splice(index, 1);
};

const openModal = () => {
    showModal.value = true;
    resetForm();
};

const closeModal = () => {
    showModal.value = false;
    resetForm();
    isEditing.value = false;
    editingIndex.value = -1;
};

const goBack = () => {
    const previousPage = getPreviousPage();
    
    console.log('Previous page detected:', previousPage);
    
    if (previousPage === 'course-lessons') {
        // Retourner à CourseLessons en utilisant l'ID du cours
        // On doit récupérer l'ID du cours depuis la leçon
        if (lesson.value.course && lesson.value.course.id) {
            router.push(`/courses/${lesson.value.course.id}`);
        } else {
            // Fallback vers la page des cours
            router.push('/courses');
        }
    } else if (previousPage === 'course') {
        // Retourner à la page des cours
        router.push('/courses');
    } else {
        // Retourner à Home
        router.push('/');
    }
};


const launchLesson = () => {
    // Lancer la leçon en allant vers Lesson.vue
    router.push(`/lessons/${lesson.value.id}`);
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

.header-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.header-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.back-btn {
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

.back-btn:hover {
    background-color: var(--primary-hover);
}

.back-icon {
    margin-right: var(--spacing-xs);
}

.Info-leçon h1 {
    margin: 0;
    font-size: var(--font-size-2xl);
    color: var(--secondary-color);
    font-weight: 600;
}

.Info-leçon span {
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

.launch-btn {
    background-color: #28a745 !important;
}

.launch-btn:hover {
    background-color: #218838 !important;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.question-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    transition: box-shadow var(--transition-normal);
}

.question-card:hover {
    box-shadow: var(--shadow-md);
}

.question-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.question-header p {
    margin: 0;
    flex: 1;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--secondary-color);
    line-height: 1.4;
}

.question-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-shrink: 0;
}

.edit-btn, .delete-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: 500;
    transition: all var(--transition-normal);
    min-height: 36px;
}

.edit-btn {
    background: var(--primary-color);
    color: var(--white);
}

.edit-btn:hover {
    background: var(--primary-hover);
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
.form-group select {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    background-color: var(--white);
    transition: border-color var(--transition-normal);
    min-height: 44px;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.type-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
}

.type-selector input {
    width: 20px;
    height: 20px;
    margin: 0;
}

.type-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-sm);
}

.type-option label {
    font-weight: 600;
    font-size: var(--font-size-base);
    margin: 0;
}

.option-input {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    align-items: center;
}

.option-input input {
    flex: 1;
}

.remove-btn {
    background: var(--accent-color);
    color: var(--white);
    width: 32px;
    height: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-size: var(--font-size-lg);
    transition: background-color var(--transition-normal);
}

.remove-btn:hover {
    background: #c0392b;
}

.add-option-btn {
    background: var(--primary-color);
    color: var(--white);
    width: 100%;
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-weight: 500;
    transition: background-color var(--transition-normal);
}

.add-option-btn:hover {
    background: var(--primary-hover);
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

/* Possibilities display */
.possibility {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--light-gray);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-xs);
}

.possibility input[type="radio"] {
    margin: 0;
    width: 16px;
    height: 16px;
}

.possibility-text {
    margin-left: var(--spacing-xs);
    color: var(--secondary-color);
}

.text-answer {
    margin-top: var(--spacing-sm);
    padding: var(--spacing-sm);
    background: var(--light-gray);
    border-radius: var(--border-radius-md);
    font-style: italic;
    color: var(--gray);
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

    .Info-leçon h1 {
        font-size: var(--font-size-xl);
    }

    .question-header {
        flex-direction: column;
        align-items: stretch;
    }

    .question-actions {
        justify-content: center;
    }

    .edit-btn, .delete-btn {
        flex: 1;
        max-width: 120px;
    }

    .modal-overlay {
        padding: var(--spacing-sm);
    }

    .modal-content {
        padding: var(--spacing-lg);
        max-width: 100%;
    }

    .type-selector {
        gap: var(--spacing-lg);
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

    .Info-leçon h1 {
        font-size: var(--font-size-lg);
    }

    .question-card {
        padding: var(--spacing-md);
    }

    .question-header p {
        font-size: var(--font-size-base);
    }

    .modal-content {
        padding: var(--spacing-md);
    }

    .modal-content h2 {
        font-size: var(--font-size-lg);
    }

    .type-selector {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .option-input {
        flex-direction: column;
        align-items: stretch;
    }

    .remove-btn {
        align-self: flex-end;
        width: 40px;
        height: 40px;
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
