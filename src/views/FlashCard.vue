<template>
    <div class="lesson-container">
        <div v-if="!loading && questions.length > 0" class="flash-card">
            <div class="flash-card-front">
                <h1>{{ questions && questions[currentIndex] ? questions[currentIndex].question : 'Chargement...' }}</h1>
            </div>
            <div v-if="showAnswer" class="flash-card-back">
                <h1>{{ questions && questions[currentIndex] ? questions[currentIndex].answer : '' }}</h1>
            </div>
            <div class="question-answer">
                <div v-if="questions && questions[currentIndex] && questions[currentIndex].type === 'text'">
                    <input type="text" v-model="answer" @keyup.enter="checkAnswer" placeholder="Tapez votre réponse..."/>
                </div>
                <div v-else-if="questions && questions[currentIndex] && (questions[currentIndex].type === 'multiple' || questions[currentIndex].type === 'qcm') && questions[currentIndex].possibilities" class="multiple-choice">
                    <div v-for="possibility in questions[currentIndex].possibilities" :key="possibility.id" class="choice-option">
                        <input type="radio" :value="possibility.possibility" v-model="selectedPossibility" :id="'possibility-' + possibility.id" />
                        <label :for="'possibility-' + possibility.id">{{ possibility.possibility }}</label>
                    </div>
                </div>  
                <div v-else-if="!questions || questions.length === 0" class="no-questions">
                    <p>Aucune question disponible pour cette leçon.</p>
                </div>
                <button v-if="questions && questions.length > 0" @click="checkAnswer">Check</button>
            </div>
            <div class="navigation">
                <span class="question-counter">{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
            </div>
        </div>
        <div v-else-if="loading" class="loading">
            <p>Chargement...</p>
        </div>
        <div v-else class="loading">
            <p>Leçon non trouvée</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QuestionService from '@/services/QuestionService';
import TestControleService from '@/services/TestControleService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const currentIndex = ref(0);
const showAnswer = ref(false);
const testControle = ref({
    questionnaireId: 0,
    nbBonneReponse: 0,
    nbQuestion: 0,
    userId: 0,
});
const questions = ref<any[]>([]);
const loading = ref(true);
const answer = ref('');
const correctAnswer = ref(false);
const selectedPossibility = ref(null);
const totalQuestions = computed(() => {
    if (!questions.value) return 0;
    return questions.value.length;
});

onMounted(async () => {
    const questionnaireId = route.params.id;
    testControle.value.questionnaireId = parseInt(questionnaireId as string);
    testControle.value.userId = parseInt(authStore.currentUser?.id || '0');
    
    console.log('=== DÉBUT DU TEST ===');
    console.log('Questionnaire ID:', testControle.value.questionnaireId);
    console.log('User ID:', testControle.value.userId);
    
    try {
        questions.value = await QuestionService.getQuestionsByQuestionnaireId(testControle.value.questionnaireId);
        testControle.value.nbQuestion = questions.value.length;
        console.log('Questions chargées:', questions.value);
        console.log('Nombre total de questions:', testControle.value.nbQuestion);
        console.log('Question actuelle (index 0):', questions.value[0]);
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
    }
    loading.value = false;
});

const checkAnswer = async () => {
    if (!questions.value || !questions.value[currentIndex.value]) return;
    
    const currentQuestion = questions.value[currentIndex.value];
    let userAnswer = '';
    
    console.log('=== VÉRIFICATION DE RÉPONSE ===');
    console.log('Index de la question actuelle:', currentIndex.value);
    console.log('Question complète:', currentQuestion);
    console.log('Type de question:', currentQuestion.type);
    console.log('Possibilités:', currentQuestion.possibilities);
    console.log('Détail des possibilités:', currentQuestion.possibilities?.map(p => ({ id: p.id, possibility: p.possibility })));
    console.log('selectedPossibility.value:', selectedPossibility.value);
    console.log('answer.value:', answer.value);
    
    // Déterminer la réponse de l'utilisateur selon le type de question
    if (currentQuestion.type === 'text') {
        userAnswer = answer.value;
        console.log('Type: Question libre - Réponse utilisateur:', userAnswer);
    } else if (currentQuestion.type === 'multiple' || currentQuestion.type === 'qcm') {
        userAnswer = selectedPossibility.value;
        console.log('Type: Question à choix multiples - Réponse utilisateur:', userAnswer);
    }
    
    console.log('Réponse attendue:', currentQuestion.answer);
    console.log('Réponse utilisateur finale:', userAnswer);
    console.log('Comparaison (sensible à la casse):', userAnswer === currentQuestion.answer);
    console.log('Comparaison (insensible à la casse):', userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim());
    
    if (userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim()) {
        console.log('✅ RÉPONSE CORRECTE!');
        correctAnswer.value = true;
        showAnswer.value = false;
        testControle.value.nbBonneReponse++;
        console.log('Score actuel:', testControle.value.nbBonneReponse, '/', testControle.value.nbQuestion);
        
        if (currentIndex.value < totalQuestions.value - 1) {
            console.log('Passage à la question suivante...');
            nextQuestion();
        } else {
            console.log('=== FIN DU TEST ===');
            console.log('Score final:', testControle.value.nbBonneReponse, '/', testControle.value.nbQuestion);
            console.log('Données du test à sauvegarder:', testControle.value);
            
            try {
                const testControleCreated = await TestControleService.createTestControle(testControle.value);
                console.log('Test sauvegardé avec succès:', testControleCreated);
                router.push(`/final-screen/${testControleCreated.id}`);
            } catch (error) {
                console.error('Erreur lors de la création du test contrôle:', error);
                alert('Erreur lors de la sauvegarde du résultat. Veuillez réessayer.');
            }
        }
    } else {
        console.log('❌ RÉPONSE INCORRECTE');
        showAnswer.value = true;
        testControle.value.nbBonneReponse--;
        console.log('Score après pénalité:', testControle.value.nbBonneReponse, '/', testControle.value.nbQuestion);
    }
};

const nextQuestion = () => {
    if (currentIndex.value < totalQuestions.value - 1) {
        const oldIndex = currentIndex.value;
        currentIndex.value++;
        showAnswer.value = false;
        selectedPossibility.value = null;
        answer.value = ''; // Réinitialiser aussi la réponse texte
        
        console.log('=== PASSAGE À LA QUESTION SUIVANTE ===');
        console.log('Ancien index:', oldIndex, '→ Nouvel index:', currentIndex.value);
        console.log('Question suivante:', questions.value[currentIndex.value]);
        console.log('Réinitialisation - selectedPossibility:', selectedPossibility.value);
        console.log('Réinitialisation - answer:', answer.value);
    }
};
</script>

<style scoped>
.lesson-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-xl);
}

.flash-card {
    width: 100%;
    min-height: 300px;
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.flash-card-front,
.flash-card-back {
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    transition: all var(--transition-normal);
}

.flash-card-front {
    background-color: var(--bg-dark);
    color: var(--white);
}

.flash-card-back {
    background-color: var(--light-gray);
    color: var(--secondary-color);
}

.flash-card-front h1,
.flash-card-back h1 {
    font-size: var(--font-size-2xl);
    text-align: center;
    line-height: 1.4;
    margin: 0;
}

.toggle-button {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.toggle-button:hover {
    background-color: #2980b9;
}

.navigation {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-md);
    gap: var(--spacing-md);
}

.navigation button {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: background-color var(--transition-normal);
    min-width: 100px;
}

.navigation button:disabled {
    background-color: var(--gray);
    cursor: not-allowed;
}

.navigation button:not(:disabled):hover {
    background-color: var(--primary-hover);
}

.navigation span {
    font-size: var(--font-size-lg);
    color: var(--secondary-color);
    font-weight: 500;
}

.question-counter {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--light-gray);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    margin-bottom: 1rem;
    margin-right: 1rem;

}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    font-size: var(--font-size-lg);
    color: var(--gray);
}

.question-answer {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.question-answer input[type="text"] {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    min-height: 44px;
}

.multiple-choice {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.choice-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: background-color var(--transition-fast);
    min-height: 44px;
}

.choice-option:hover {
    background-color: var(--light-gray);
}

.choice-option input[type="radio"] {
    margin: 0;
    width: 18px;
    height: 18px;
}

.choice-option label {
    cursor: pointer;
    margin: 0;
    flex: 1;
    font-size: var(--font-size-base);
}

.question-answer button {
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--primary-color);
    color: var(--white);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    font-size: var(--font-size-base);
    min-height: 44px;
    font-weight: 500;
}

.question-answer button:hover {
    background-color: var(--primary-hover);
}

.no-questions {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--gray);
    font-style: italic;
}

/* Media queries */
@media (max-width: 768px) {
    .lesson-container {
        padding: var(--spacing-md);
    }

    .flash-card {
        min-height: 250px;
    }

    .flash-card-front,
    .flash-card-back {
        padding: var(--spacing-lg);
    }

    .flash-card-front h1,
    .flash-card-back h1 {
        font-size: var(--font-size-xl);
    }

    .navigation {
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .navigation button {
        width: 100%;
        max-width: 200px;
    }

    .question-answer {
        padding: var(--spacing-sm);
    }
}

@media (max-width: 480px) {
    .lesson-container {
        padding: var(--spacing-sm);
    }

    .flash-card {
        min-height: 200px;
    }

    .flash-card-front,
    .flash-card-back {
        padding: var(--spacing-md);
    }

    .flash-card-front h1,
    .flash-card-back h1 {
        font-size: var(--font-size-lg);
    }

    .question-answer input[type="text"],
    .choice-option {
        min-height: 40px;
        font-size: var(--font-size-sm);
    }

    .choice-option input[type="radio"] {
        width: 16px;
        height: 16px;
    }

    .choice-option label {
        font-size: var(--font-size-sm);
    }

    .question-answer button {
        min-height: 40px;
        font-size: var(--font-size-sm);
    }
}

@media (min-width: 1024px) {
    .lesson-container {
        max-width: 900px;
    }

    .flash-card {
        min-height: 350px;
    }

    .flash-card-front h1,
    .flash-card-back h1 {
        font-size: var(--font-size-3xl);
    }
}
</style> 