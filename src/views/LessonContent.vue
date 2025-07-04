<template>
    <div class="lesson-content-container">
        <div v-if="!loading && currentLesson" class="content-wrapper">
            <!-- En-tête de la leçon -->
            <div class="lesson-header">
                <h1>{{ currentLesson.title }}</h1>
                <p class="course-title">{{ currentLesson.courseTitle }}</p>
            </div>

            <!-- Section des questionnaires -->
            <div class="questionnaires-section">
                <h2>Questionnaires</h2>
                <div class="questionnaires-grid">
                    <div 
                        v-for="(questionnaire, index) in questionnaires" 
                        :key="questionnaire.id"
                        class="questionnaire-card"
                    >
                        <div class="questionnaire-icon">📝</div>
                        <h3>{{ questionnaire.title }}</h3>
                        <p>Niveau : {{ questionnaire.title.toLowerCase().includes('facile') ? 'Facile' : questionnaire.title.toLowerCase().includes('difficile') ? 'Difficile' : 'Standard' }}</p>
                        <button class="start-btn" @click="startQuestionnaire(questionnaire.id)">Commencer</button>
                    </div>
                    <div v-if="questionnaires.length === 0" class="questionnaire-card">
                        <div class="questionnaire-icon">❓</div>
                        <h3>Aucun questionnaire</h3>
                        <p>Pas de quiz disponible pour cette leçon.</p>
                    </div>
                </div>
            </div>

            <!-- Contenu de la leçon -->
            <div class="lesson-content">
                <div class="content-text">
                    <h2>Contenu de la leçon</h2>
                    <div class="text-content" v-html="currentLesson.description"></div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="navigation-actions">
                <button @click="goBack" class="back-btn">
                    ← Retour aux cours
                </button>
                <div class="action-buttons">
                    <button @click="openEditModal" class="edit-content-btn">
                        ✏️ Modifier le contenu
                    </button>
                </div>
            </div>
        </div>

        <!-- États de chargement et d'erreur -->
        <div v-else-if="loading" class="loading">
            <p>Chargement du contenu de la leçon...</p>
        </div>
        <div v-else class="error">
            <p>Leçon non trouvée</p>
            <button @click="goBack" class="back-btn">Retour</button>
        </div>

        <!-- Modal d'édition du contenu -->
        <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Modifier le contenu de la leçon</h2>
                    <button @click="closeEditModal" class="close-btn">&times;</button>
                </div>
                <form @submit.prevent="updateLessonContent" class="edit-form">
                    <div class="form-group">
                        <label for="edit-title">Titre de la leçon *</label>
                        <input 
                            id="edit-title"
                            v-model="editingLesson.title" 
                            type="text" 
                            required 
                            placeholder="Entrez le titre de la leçon"
                            class="form-input"
                        />
                    </div>
                    <div class="form-group">
                        <label for="edit-description">Contenu de la leçon *</label>
                        <textarea 
                            id="edit-description"
                            v-model="editingLesson.description" 
                            required 
                            placeholder="Entrez le contenu de la leçon..."
                            class="form-textarea"
                            rows="10"
                        ></textarea>
                        <small class="help-text">
                            Utilisez des retours à la ligne pour créer des paragraphes.
                        </small>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="closeEditModal" class="cancel-btn">
                            Annuler
                        </button>
                        <button type="submit" :disabled="updating" class="submit-btn">
                            {{ updating ? 'Modification...' : 'Modifier le contenu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LessonService from '@/services/LessonService';
import QuestionnaireService from '@/services/QuestionnaireService';

const router = useRouter();
const route = useRoute();

const currentLesson = ref<any>(null);
const questionnaires = ref<any[]>([]);
const loading = ref(true);
const showEditModal = ref(false);
const editingLesson = ref({
    title: '',
    description: ''
});
const updating = ref(false);

onMounted(async () => {
    try {
        const lessonId = route.params.id;
        currentLesson.value = await LessonService.getLessonById(parseInt(lessonId as string));
        questionnaires.value = await QuestionnaireService.getQuestionnairesByLessonId(currentLesson.value.id);
        loading.value = false;
    } catch (error) {
        console.error('Erreur lors du chargement de la leçon:', error);
        loading.value = false;
    }
});

const startQuestionnaire = (questionnaireId: number) => {
    router.push(`/flashcard/${questionnaireId}`);
};

const goBack = () => {
    router.push(`/courses/${currentLesson.value?.courseId || ''}`);
};

const closeEditModal = () => {
    showEditModal.value = false;
};

const openEditModal = () => {
    editingLesson.value = {
        title: currentLesson.value.title,
        description: currentLesson.value.description
    };
    showEditModal.value = true;
};

const updateLessonContent = async () => {
    if (!editingLesson.value.title.trim() || !editingLesson.value.description.trim()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        updating.value = true;
        await LessonService.updateLesson(currentLesson.value.id, editingLesson.value);
        currentLesson.value.title = editingLesson.value.title;
        currentLesson.value.description = editingLesson.value.description;
        showEditModal.value = false;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la leçon:', error);
        alert('Erreur lors de la mise à jour de la leçon. Veuillez réessayer.');
    } finally {
        updating.value = false;
    }
};
</script>

<style scoped>
.lesson-content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
}

.content-wrapper {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.lesson-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    text-align: center;
}

.lesson-header h1 {
    margin: 0 0 10px 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.course-title {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
}

.questionnaires-section {
    padding: 40px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.questionnaires-section h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8rem;
    border-bottom: 2px solid #28a745;
    padding-bottom: 10px;
    text-align: center;
}

.questionnaires-grid {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
}

.questionnaire-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    min-width: 250px;
    max-width: 300px;
    flex: 1;
}

.questionnaire-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: #28a745;
}

.questionnaire-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #28a745, #20c997);
}

.questionnaire-icon {
    font-size: 3rem;
    margin-bottom: 16px;
}

.questionnaire-card h3 {
    color: #333;
    margin: 0 0 12px 0;
    font-size: 1.3rem;
}

.questionnaire-card p {
    color: #666;
    margin: 0 0 20px 0;
    font-size: 0.95rem;
    line-height: 1.5;
}

.lesson-content {
    padding: 40px;
}

.content-text {
    max-width: 100%;
    margin: 0 auto;
}

.content-text h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 1.8rem;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
}

.text-content {
    line-height: 1.8;
    font-size: 1.2rem;
    color: #2c3e50;
    height: 85vh;
    overflow-y: auto;
    padding-right: 10px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: 400;
}

.text-content :deep(p) {
    margin-bottom: 18px;
    text-align: justify;
    color:rgb(0, 0, 0);
    font-size: 1.2rem;
    line-height: 1.8;
}

.text-content :deep(h1), .text-content :deep(h2), .text-content :deep(h3), .text-content :deep(h4), .text-content :deep(h5), .text-content :deep(h6) {
    color: #1a202c;
    font-weight: 600;
    margin-top: 24px;
    margin-bottom: 16px;
}

.text-content :deep(strong), .text-content :deep(b) {
    font-weight: 600;
    color: #1a202c;
}

.text-content :deep(em), .text-content :deep(i) {
    font-style: italic;
    color: #4a5568;
}

.text-content :deep(code) {
    background-color: #f7fafc;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: #e53e3e;
    border: 1px solid #e2e8f0;
}



.start-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.start-btn:hover {
    background: #218838;
}

.navigation-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    gap: 20px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

.back-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.back-btn:hover {
    background: #5a6268;
}

.edit-content-btn {
    background: #ffc107;
    color: #212529;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.edit-content-btn:hover {
    background: #e0a800;
}

.start-all-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.start-all-btn:hover {
    background: #0056b3;
}

.loading, .error {
    text-align: center;
    padding: 60px 20px;
    color: #666;
}

.error {
    color: #dc3545;
}

/* Responsive design */
@media (max-width: 768px) {
    .lesson-content-container {
        padding: 10px;
    }
    
    .lesson-header {
        padding: 30px 20px;
    }
    
    .lesson-header h1 {
        font-size: 2rem;
    }
    
    .questionnaires-section {
        padding: 20px;
    }
    
    .questionnaires-grid {
        flex-direction: column;
        align-items: center;
    }
    
    .questionnaire-card {
        min-width: auto;
        max-width: 100%;
        width: 100%;
    }
    
    .lesson-content {
        padding: 20px;
    }
    
    .content-text {
        margin-bottom: 20px;
    }
    
    .navigation-actions {
        flex-direction: column;
        padding: 20px;
    }
    
    .back-btn, .start-all-btn {
        width: 100%;
        justify-content: center;
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    width: 80%;
    max-width: 600px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.8rem;
    font-weight: 700;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.edit-form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.form-input, .form-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
}

.form-textarea {
    resize: vertical;
}

.help-text {
    display: block;
    margin-top: 8px;
    font-size: 0.9rem;
    color: #666;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.cancel-btn {
    background: #6c757d;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-right: 10px;
}

.cancel-btn:hover {
    background: #5a6268;
}

.submit-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.submit-btn:hover {
    background: #0056b3;
}
</style> 