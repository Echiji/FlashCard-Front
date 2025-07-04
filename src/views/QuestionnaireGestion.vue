<template>
    <div class="questionnaire-management">
        <!-- Header avec titre et bouton de création -->
        <div class="page-header">
            <div class="header-content">
                <h1 class="page-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                    Gestion des questionnaires
                </h1>
            </div>
            <button class="create-btn" @click="showCreateModal = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nouveau questionnaire
            </button>
        </div>
        <!-- Liste des questionnaires -->
        <div class="questionnaires-grid">
            <QuestionnaireCard 
                v-for="questionnaire in questionnaires" 
                :key="questionnaire.id" 
                :questionnaire="questionnaire"
                @delete="deleteQuestionnaire"
                @delete-questionnaire="deleteQuestionnaire"
                @edit-question="handleEditQuestion"
                @delete-question="handleDeleteQuestion"
                @create-question="handleCreateQuestion"
            />
        </div>

        <!-- Message si aucun questionnaire -->
        <div v-if="questionnaires.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14,2 14,8 20,8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            <h3>Aucun questionnaire</h3>
            <p>Commencez par créer votre premier questionnaire pour cette leçon.</p>
            <button class="btn btn-primary" @click="showCreateModal = true">
                Créer un questionnaire
            </button>
        </div>
    </div>

    <!-- Modal de création -->
    <Modal :is-open="showCreateModal" title="Créer un nouveau questionnaire" @close="closeCreateModal">
        <form @submit.prevent="createQuestionnaire" class="create-form">
            <div class="form-group">
                <label for="newTitle" class="form-label">Titre du questionnaire</label>
                <input 
                    type="text" 
                    v-model="newQuestionnaire.title" 
                    id="newTitle" 
                    class="form-input"
                    placeholder="Ex: Quiz sur les bases de Vue.js"
                    required 
                />
            </div>
        </form>
        
        <template #footer>
            <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                Annuler
            </button>
            <button type="button" class="btn btn-primary" @click="createQuestionnaire">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Créer
            </button>
        </template>
    </Modal>

    <Modal
      :is-open="showEditModal"
      title="Modifier le questionnaire"
      @close="closeEditModal"
    >
      <form @submit.prevent="saveEditedQuestionnaire">
        <div class="form-group">
          <label for="editTitle">Titre</label>
          <input
            id="editTitle"
            v-model="editingQuestionnaire.title"
            class="form-input"
            required
          />
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button type="button" class="btn btn-secondary" @click="closeEditModal">Annuler</button>
          <button type="submit" class="btn btn-primary">Enregistrer</button>
        </div>
      </form>
    </Modal>

    <Modal
      :is-open="showCreateQuestionModal"
      title="Créer une nouvelle question"
      @close="showCreateQuestionModal = false"
    >
      <form @submit.prevent="saveNewQuestion" class="question-form">
        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Intitulé de la question *
          </label>
          <textarea 
            v-model="newQuestion.question" 
            required 
            class="form-textarea question-textarea"
            placeholder="Entrez votre question ici..."
            rows="3"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            Type de question *
          </label>
          <div class="type-selector">
            <label class="type-option" :class="{ active: newQuestion.type === 'multiple' }">
              <input 
                type="radio" 
                v-model="newQuestion.type" 
                value="multiple" 
                @change="onTypeChange"
                class="type-radio"
              />
              <div class="type-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>Choix multiples</span>
              </div>
            </label>
            <label class="type-option" :class="{ active: newQuestion.type === 'text' }">
              <input 
                type="radio" 
                v-model="newQuestion.type" 
                value="text" 
                @change="onTypeChange"
                class="type-radio"
              />
              <div class="type-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                </svg>
                <span>Réponse libre</span>
              </div>
            </label>
          </div>
        </div>

        <div class="form-group" v-if="newQuestion.type === 'multiple'">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,11 12,14 22,4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Options de réponse *
          </label>
          <div class="possibilities-container">
            <div 
              v-for="(p, i) in newQuestion.possibilities" 
              :key="i" 
              class="possibility-item"
            >
              <div class="possibility-input-wrapper">
                <span class="possibility-number">{{ String.fromCharCode(65 + i) }}</span>
                <input 
                  v-model="newQuestion.possibilities[i].value" 
                  class="form-input possibility-input"
                  :placeholder="`Option ${String.fromCharCode(65 + i)}`"
                />
                <button 
                  type="button" 
                  @click="removePossibility(i)"
                  class="remove-possibility-btn"
                  :disabled="newQuestion.possibilities.length <= 2"
                  title="Supprimer cette option"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <button 
              type="button" 
              @click="addPossibility"
              class="add-possibility-btn"
              :disabled="newQuestion.possibilities.length >= 6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Ajouter une option
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Réponse correcte *
          </label>
          
          <!-- Menu déroulant pour les questions à choix multiples -->
          <select 
            v-if="newQuestion.type === 'multiple'"
            v-model="newQuestion.answer" 
            required 
            class="form-input answer-select"
          >
            <option value="" disabled>Sélectionnez la réponse correcte</option>
            <option 
              v-for="(possibility, index) in newQuestion.possibilities" 
              :key="index"
              :value="possibility.value"
              :disabled="!possibility.value.trim()"
            >
              {{ String.fromCharCode(65 + index) }}. {{ possibility.value || `Option ${String.fromCharCode(65 + index)}` }}
            </option>
          </select>
          
          <!-- Champ texte pour les questions libres -->
          <input 
            v-else
            v-model="newQuestion.answer" 
            required 
            class="form-input answer-input"
            placeholder="Entrez la réponse attendue"
          />
          
          <small class="help-text" v-if="newQuestion.type === 'multiple'">
            Sélectionnez la réponse correcte parmi les options définies ci-dessus
          </small>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="showCreateQuestionModal = false">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            Annuler
          </button>
          <button type="submit" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
            Créer la question
          </button>
        </div>
      </form>
    </Modal>


</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import QuestionnaireService, { Questionnaire } from '@/services/QuestionnaireService';
import { useRoute } from 'vue-router';
import QuestionnaireCard from '@/components/QuestionnaireCard.vue';
import Modal from '@/components/Modal.vue';
import { Lesson } from '@/services/LessonService';
import QuestionService from '@/services/QuestionService';

const lessonId = ref(0);
const questionnaires = ref<Questionnaire[]>([]);
const lesson = ref<Lesson>({});
const route = useRoute();
const showCreateModal = ref(false);
const newQuestionnaire = ref({ title: '', description: '' });
const showModal = ref(false);
const editingQuestionnaire = ref<Questionnaire | null>(null);
const showEditModal = ref(false);

// Computed properties
const totalQuestions = computed(() => {
    return questionnaires.value.reduce((total, questionnaire) => {
        return total + (questionnaire.questions?.length || 0);
    }, 0);
});
const showCreateQuestionModal = ref(false);
const newQuestion = ref({
    question: '',
    type: 'multiple',
    answer: '',
    questionnaireId: null,
    possibilities: [{ value: '' }, { value: '' }]
});

const getQuestionnaires = async () => {
    try {
        questionnaires.value = await QuestionnaireService.getQuestionnaireByLessonId(lessonId.value);
    } catch (error) {
        console.error('Erreur lors du chargement des questionnaires:', error);
    }
};          

const deleteQuestionnaire = async (id: number) => {
    try {
        await QuestionnaireService.deleteQuestionnaire(id);
        await getQuestionnaires();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du questionnaire');
    }
};

const createQuestionnaire = async () => {
    try {
        if (!newQuestionnaire.value.title.trim()) {
            alert('Le titre est obligatoire');
            return;
        }
        
        await QuestionnaireService.createQuestionnaire({
            title: newQuestionnaire.value.title.trim(),
            lessonId: lessonId.value,
            description: newQuestionnaire.value.description.trim() || undefined
        });
        
        closeCreateModal();
        await getQuestionnaires();
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        alert('Erreur lors de la création du questionnaire');
    }
};

const closeCreateModal = () => {
    showCreateModal.value = false;
    newQuestionnaire.value = { title: '', description: '' };
};

const handleEditQuestion = (question: any) => {
    // S'assurer qu'on a bien un objet question
    const questionToEdit = typeof question === 'object' ? question : { id: question };
    editingQuestionnaire.value = { ...questionToEdit };
    showEditModal.value = true;
};

const handleDeleteQuestion = async (questionId: number) => {
    try {
        console.log('Suppression de la question avec ID:', questionId);
        await QuestionService.deleteQuestion(questionId);
        await getQuestionnaires();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la question');
    }
};

const saveEditedQuestionnaire = async () => {
    await QuestionnaireService.updateQuestionnaire(editingQuestionnaire.value.id, editingQuestionnaire.value);
    showEditModal.value = false;
    editingQuestionnaire.value = null;
    await getQuestionnaires();
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingQuestionnaire.value = null;
};

const handleCreateQuestion = async (questionnaireId) => {
    try {
        newQuestion.value = {
            question: '',
            type: 'multiple',
            answer: '',
            questionnaireId,
            possibilities: [{ value: '' }, { value: '' }]
        };
        showCreateQuestionModal.value = true;
    } catch (error) {
        console.error('Erreur lors de la création de la question:', error);
    }
};

const saveNewQuestion = async () => {
    try {
        // Validation
        if (!newQuestion.value.question.trim()) {
            alert('L\'intitulé de la question est obligatoire');
            return;
        }
        if (!newQuestion.value.answer.trim()) {
            alert('La réponse correcte est obligatoire');
            return;
        }

        // Préparer l'objet selon le type
        let questionToSend;
        
        if (newQuestion.value.type === 'text') {
            // Question libre - pas de possibilités
            questionToSend = {
                question: newQuestion.value.question.trim(),
                type: 'text',
                answer: newQuestion.value.answer.trim(),
                questionnaireId: newQuestion.value.questionnaireId
                // Pas de possibilities pour les questions libres
            };
        } else if (newQuestion.value.type === 'multiple') {
            // Question à choix multiples
            const validPossibilities = newQuestion.value.possibilities
                .filter(p => p.value && p.value.trim())
                .map((p, index) => ({
                    value: p.value.trim()
                }));
            
            if (validPossibilities.length < 2) {
                alert('Les questions à choix multiples doivent avoir au moins 2 possibilités');
                return;
            }
            
            questionToSend = {
                question: newQuestion.value.question.trim(),
                type: 'multiple',
                answer: newQuestion.value.answer.trim(),
                questionnaireId: newQuestion.value.questionnaireId,
                possibilities: validPossibilities
            };
        }

        console.log('Question à envoyer:', questionToSend);
        
        await QuestionService.createQuestion(questionToSend);
        showCreateQuestionModal.value = false;
        await getQuestionnaires();
    } catch (error) {
        console.error('Erreur lors de la création de la question:', error);
        alert('Erreur lors de la création de la question');
    }
};

const onTypeChange = () => {
    // Réinitialiser les possibilités quand on change de type
    if (newQuestion.value.type === 'text') {
        newQuestion.value.possibilities = [];
        newQuestion.value.answer = ''; // Réinitialiser la réponse
    } else if (newQuestion.value.type === 'multiple') {
        newQuestion.value.possibilities = [{ value: '' }, { value: '' }];
        newQuestion.value.answer = ''; // Réinitialiser la réponse
    }
};

const addPossibility = () => {
    if (newQuestion.value.possibilities.length < 6) {
        newQuestion.value.possibilities.push({ value: '' });
    }
};

const removePossibility = (index: number) => {
    if (newQuestion.value.possibilities.length > 2) {
        newQuestion.value.possibilities.splice(index, 1);
        // Vérifier si la réponse actuelle est toujours valide
        validateAnswer();
    }
};

const validateAnswer = () => {
    // Si la réponse actuelle n'est plus dans les possibilités, la réinitialiser
    const validAnswers = newQuestion.value.possibilities
        .filter(p => p.value.trim())
        .map(p => p.value);
    
    if (!validAnswers.includes(newQuestion.value.answer)) {
        newQuestion.value.answer = '';
    }
};

onMounted(() => {
    lessonId.value = Number(route.params.id);
    getQuestionnaires();
});

// Watcher pour valider la réponse quand les possibilités changent
watch(() => newQuestion.value.possibilities, () => {
    if (newQuestion.value.type === 'multiple') {
        validateAnswer();
    }
}, { deep: true });
</script>

<style scoped>
.questionnaire-management {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

/* Header */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--border-color);
}

.header-content {
    flex: 1;
}

.page-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--secondary-color);
    margin: 0 0 var(--spacing-sm) 0;
}

.page-title svg {
    color: var(--primary-color);
}

.page-subtitle {
    color: var(--gray);
    font-size: var(--font-size-base);
    margin: 0;
}

.create-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: linear-gradient(135deg, var(--primary-color) 0%, #5a67d8 100%);
    color: white;
    border: none;
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.create-btn svg {
    width: 16px;
    height: 16px;
}

/* Stats Section */
.stats-section {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.stat-card {
    background: white;
    padding: var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    text-align: center;
    min-width: 150px;
    border: 2px solid var(--border-color);
    transition: all var(--transition-fast);
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-color);
}

.stat-number {
    display: block;
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: var(--font-size-sm);
    color: var(--gray);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Grid */
.questionnaires-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-3xl);
    background: white;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    border: 2px dashed var(--border-color);
}

.empty-state svg {
    color: var(--gray);
    margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
    font-size: var(--font-size-xl);
    color: var(--secondary-color);
    margin: 0 0 var(--spacing-sm) 0;
}

.empty-state p {
    color: var(--gray);
    margin: 0 0 var(--spacing-lg) 0;
    font-size: var(--font-size-base);
}

/* Form Styles */
.create-form {
    width: 100%;
}

.form-group {
    margin-bottom: var(--spacing-lg);
}

.form-label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 600;
    color: var(--secondary-color);
    font-size: var(--font-size-base);
}

.form-input, .form-textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-fast);
    background: var(--white);
    font-family: inherit;
}

.form-input:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 80px;
}

/* Button Styles */
.btn {
    padding: var(--spacing-sm) var(--spacing-lg);
    border: none;
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    min-height: 44px;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, #5a67d8 100%);
    color: var(--white);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: var(--light-gray);
    color: var(--secondary-color);
    border: 2px solid var(--border-color);
}

.btn-secondary:hover {
    background: var(--gray);
    color: var(--white);
    border-color: var(--gray);
}

/* Responsive */
@media (max-width: 768px) {
    .questionnaire-management {
        padding: var(--spacing-md);
    }
    
    .page-header {
        flex-direction: column;
        gap: var(--spacing-lg);
        align-items: flex-start;
    }
    
    .create-btn {
        width: 100%;
        justify-content: center;
    }
    
    .stats-section {
        flex-direction: column;
        gap: var(--spacing-md);
    }
    
    .questionnaires-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .empty-state {
        padding: var(--spacing-xl);
    }
}

@media (max-width: 480px) {
    .questionnaire-management {
        padding: var(--spacing-sm);
    }
    
    .page-title {
        font-size: var(--font-size-xl);
    }
    
    .stat-card {
        padding: var(--spacing-md);
    }
    
    .stat-number {
        font-size: var(--font-size-2xl);
    }
}

.question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.question-actions {
    display: flex;
    gap: 4px;
    margin-left: 8px;
}

.q-edit-btn, .q-delete-btn {
    background: none;
    border: none;
    padding: 4px 6px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.15s;
}

.q-edit-btn:hover {
    background: #e3eafe;
}
.q-delete-btn:hover {
    background: #ffe3e3;
}
.q-edit-btn svg {
    color: #1976d2;
}
.q-delete-btn svg {
    color: #dc3545;
}

/* Question Form Styles */
.question-form {
    width: 100%;
    max-width: 600px;
}

.question-textarea {
    min-height: 80px;
    resize: vertical;
    font-family: inherit;
    line-height: 1.5;
}

.type-selector {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-sm);
}

.type-option {
    flex: 1;
    cursor: pointer;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    transition: all var(--transition-fast);
    background: var(--white);
    position: relative;
}

.type-option:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.type-option.active {
    border-color: var(--primary-color);
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.type-radio {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.type-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    text-align: center;
}

.type-content svg {
    color: var(--primary-color);
}

.type-content span {
    font-weight: 600;
    color: var(--secondary-color);
    font-size: var(--font-size-sm);
}

.possibilities-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
}

.possibility-item {
    position: relative;
}

.possibility-input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background: var(--white);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-sm);
    transition: border-color var(--transition-fast);
}

.possibility-input-wrapper:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.possibility-number {
    background: var(--primary-color);
    color: var(--white);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);
    font-weight: 600;
    flex-shrink: 0;
}

.possibility-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: var(--spacing-sm);
    font-size: var(--font-size-base);
}

.possibility-input:focus {
    outline: none;
    box-shadow: none;
}

.remove-possibility-btn {
    background: #ff4757;
    color: var(--white);
    border: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
}

.remove-possibility-btn:hover:not(:disabled) {
    background: #ff3742;
    transform: scale(1.1);
}

.remove-possibility-btn:disabled {
    background: var(--gray);
    cursor: not-allowed;
    opacity: 0.5;
}

.add-possibility-btn {
    background: var(--light-gray);
    color: var(--secondary-color);
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
    margin-top: var(--spacing-sm);
}

.add-possibility-btn:hover:not(:disabled) {
    background: var(--primary-color);
    color: var(--white);
    border-color: var(--primary-color);
    transform: translateY(-1px);
}

.add-possibility-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.answer-input {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%);
    border-color: #4caf50;
}

.answer-input:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.answer-select {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%);
    border-color: #4caf50;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234caf50' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 12px center;
    background-repeat: no-repeat;
    background-size: 16px;
    padding-right: 40px;
}

.answer-select:focus {
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.answer-select option {
    padding: var(--spacing-sm);
    background: var(--white);
    color: var(--secondary-color);
}

.answer-select option:disabled {
    color: var(--gray);
    font-style: italic;
}

.answer-select option:checked {
    background: var(--primary-color);
    color: var(--white);
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
}

.form-actions .btn {
    min-width: 120px;
    justify-content: center;
}

.help-text {
    display: block;
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--gray);
    font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .type-selector {
        flex-direction: column;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .form-actions .btn {
        width: 100%;
    }
}
</style>