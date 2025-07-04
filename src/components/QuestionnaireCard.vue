<template>
    <div class="questionnaire-card">
        <!-- Header avec titre et bouton d'action -->
        <div class="card-header">
            <div class="title-section">
                <h3 class="card-title">{{ questionnaire.title }}</h3>
                <div class="question-count">
                    <span class="count-badge">{{ questionnaire.questions.length }}</span>
                    <span class="count-text">questions</span>
                </div>
            </div>
            <div class="action-buttons">

                <button class="edit-btn" @click="$emit('edit-question', questionnaire)" title="Modifier le questionnaire">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Modifier
                </button>
                <button class="delete-btn" @click="handleDeleteQuestionnaire" title="Supprimer le questionnaire">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Supprimer
                </button>
                <button class="create-question-btn" @click="$emit('create-question', questionnaire.id)">
                    Ajouter une question
                </button>
            </div>
        </div>
        <!-- Liste des questions -->
        <div class="questions-section">
            <h4 class="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                </svg>
                Questions
            </h4>
            
            <div class="questions-list">
                <div v-for="(q, index) in questionnaire.questions" :key="q.id" class="question-item">
                    <div class="question-header">
                        <span class="question-text">{{ q.question }}</span>
                        <div class="question-actions">
                            <button 
                                class="q-delete-btn" 
                                @click="$emit('delete-question', q.id)"
                                title="Supprimer la question"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div v-if="q.possibilities && q.possibilities.length" class="possibilities">
                        <div v-for="p in q.possibilities" :key="p.id || p.possibility" 
                             class="possibility-item" 
                             :class="{ 'correct-answer': p.possibility === q.answer }">
                            <span class="possibility-dot" :class="{ 'correct-dot': p.possibility === q.answer }"></span>
                            <span class="possibility-text">{{ p.possibility }}</span>
                            <span v-if="p.possibility === q.answer" class="correct-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                                Correcte
                            </span>
                        </div>
                    </div>
                    
                    <div v-else class="answer-section">
                        <span class="answer-label">Réponse :</span>
                        <span class="answer-text">{{ q.answer }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Questionnaire } from '@/services/QuestionnaireService';
import QuestionnaireService from '@/services/QuestionnaireService';
import QuestionService from '@/services/QuestionService';

const props = defineProps<{
    questionnaire: Questionnaire;
}>();

const emit = defineEmits<{
  'edit-question': [question: any];
  'delete-question': [questionId: number];
  'delete-questionnaire': [questionnaireId: number];
  'create-question': [questionnaireId: number];
  delete: [id: number];
  edit: [questionnaire: Questionnaire];
}>();



onMounted(() => {
});

const handleDeleteQuestionnaire = () => {
    emit('delete-questionnaire', props.questionnaire.id);
};

const addPossibility = () => {
    newQuestion.value.possibilities.push({ value: '' });
};
const removePossibility = (i: number) => {
    newQuestion.value.possibilities.splice(i, 1);
};
</script>

<style scoped>
.questionnaire-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    margin: 16px;
    width: 480px;
    min-height: 280px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.questionnaire-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    z-index: 1;
}

.questionnaire-card > * {
    position: relative;
    z-index: 2;
}

.questionnaire-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* Header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 16px;
}

.title-section {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card-title {
    color: white;
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    line-height: 1.3;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
    text-align: center;
}

.question-count {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    margin-top: 6px;
}

.count-badge {
    background: #fff;
    color: #667eea;
    padding: 2px 6px;
    font-size: 1.2rem;
    font-weight: 500;
    border: 2px solid #667eea;
    box-shadow: 0 1px 4px rgba(102, 126, 234, 0.10);
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    min-height: 36px;
}

.count-text {
    color: #222;
    font-size: 1.3rem;
    font-weight: 600;
    margin-left: 0;
    letter-spacing: 0.2px;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    min-width: 140px;
}

.edit-btn, .delete-btn, .create-question-btn {
    width: 100%;
    box-sizing: border-box;
}

.edit-btn, .delete-btn, .create-question-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
    min-width: 90px;
    justify-content: center;
    white-space: nowrap;
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.delete-btn {
    background: rgba(220, 53, 69, 0.8);
    border-color: rgba(220, 53, 69, 0.9);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.delete-btn:hover {
    background: rgba(220, 53, 69, 1);
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(220, 53, 69, 0.4);
}

.edit-btn svg, .delete-btn svg {
    width: 14px;
    height: 14px;
}

/* Description */
.card-description {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 20px 0;
    font-style: italic;
}

/* Questions Section */
.questions-section {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(10px);
}

.section-title {
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.section-title svg {
    color: #667eea;
}

.questions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.question-item {
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 8px;
    background: #f8f9fa;
}

.question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.question-text {
    flex: 1;
    font-size: 14px;
    color: #333;
    line-height: 1.4;
}

.question-actions {
    display: flex;
    gap: 4px;
    margin-left: 8px;
}

.q-edit-btn, .q-delete-btn {
    background: none;
    border: none;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 32px;
    min-height: 32px;
}

.q-edit-btn:hover {
    background: #e3f2fd;
    transform: translateY(-1px);
}

.q-delete-btn:hover {
    background: #ffebee;
    transform: translateY(-1px);
}

.q-edit-btn svg {
    color: #1976d2;
    width: 14px;
    height: 14px;
}

.q-delete-btn svg {
    color: #dc3545;
    width: 14px;
    height: 14px;
}

.q-edit-btn:active, .q-delete-btn:active {
    transform: translateY(0);
}

/* Possibilities */
.possibilities {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.possibility-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 0.85rem;
    color: #555;
    transition: all 0.2s ease;
    border: 2px solid transparent;
}

.possibility-item:hover {
    background: #f0f0f0;
    transform: translateX(2px);
}

.possibility-item.correct-answer {
    background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
    border: 2px solid #4caf50;
    box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
    position: relative;
}

.possibility-item.correct-answer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(76, 175, 80, 0.1) 50%, transparent 70%);
    border-radius: 8px;
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.possibility-dot {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.possibility-dot.correct-dot {
    background: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.3);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    70% { box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
    100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

.possibility-text {
    flex: 1;
    font-size: 0.85rem;
    color: #555;
    font-weight: 500;
}

.possibility-item.correct-answer .possibility-text {
    color: #2e7d32;
    font-weight: 600;
}

.correct-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
    animation: bounce 1s ease-in-out;
}

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-3px); }
    60% { transform: translateY(-1px); }
}

.correct-badge svg {
    width: 10px;
    height: 10px;
}

/* Answer Section */
.answer-section {
    background: #e8f5e8;
    padding: 8px 12px;
    border-radius: 6px;
    border-left: 3px solid #4caf50;
}

.answer-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #2e7d32;
    margin-right: 8px;
}

.answer-text {
    font-size: 0.85rem;
    color: #1b5e20;
    font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
    .questionnaire-card {
        width: 100%;
        margin: 12px 0;
        padding: 20px;
    }
    
    .card-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }
    
    .edit-btn {
        align-self: flex-end;
    }
    
    . {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .questionnaire-card {
        padding: 16px;
        border-radius: 12px;
    }
    
    .card-title {
        font-size: 1.2rem;
    }
    
    .questions-section {
        padding: 16px;
    }
    
    .question-item {
        padding: 12px;
    }
}

/* Modal Form Styles */
.modal-form {
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

.form-input {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    transition: border-color var(--transition-fast);
    background: var(--white);
}

.form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
    color: var(--gray);
    opacity: 0.7;
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

.create-question-btn {
    background: #28a745;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.create-question-btn:hover {
    background: #218838;
}


</style>    