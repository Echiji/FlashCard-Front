<template>
    <div class="lesson-container">
        <div v-if="!loading && currentLesson" class="flash-card">
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
                <div v-else-if="questions && questions[currentIndex] && questions[currentIndex].type === 'multiple' && questions[currentIndex].possibilities" class="multiple-choice">
                    <div v-for="(possibility, index) in questions[currentIndex].possibilities" :key="index" class="choice-option">
                        <input type="radio" :id="'option-' + index" :value="possibility.value" v-model="answer">
                        <label :for="'option-' + index">{{ possibility.value }}</label>
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
import LessonService from '@/services/LessonService';
import QuestionService from '@/services/QuestionService';
import TestControleService from '@/services/TestControleService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const currentIndex = ref(0);
const showAnswer = ref(false);
const currentLesson = ref(null);
const testControle = ref({
    lessonId: 0,
    nbBonneReponse: 0,
    nbQuestion: 0,
    userId: 0,
});
const questions = ref(null);    
const loading = ref(true);
const answer = ref('');
const correctAnswer = ref(false);

onMounted(async () => {
        const lessonId = route.params.id;
        currentLesson.value = await LessonService.getLessonById(parseInt(lessonId as string));
        questions.value = await QuestionService.getQuestionsByLesson(currentLesson.value);
        console.log(authStore.currentUser)
        testControle.value.lessonId = currentLesson.value.id;
        testControle.value.nbQuestion = questions.value.length;
        testControle.value.userId = parseInt(authStore.currentUser?.id || '0');
        console.log(testControle.value)
        loading.value = false;
    }
);

const totalQuestions = computed(() => {
    if (!questions.value) return 0;
    return questions.value.length;
});

const checkAnswer = async () => {
    if (!questions.value || !questions.value[currentIndex.value]) return;
    
    if (answer.value.toLowerCase() === questions.value[currentIndex.value].answer.toLowerCase()) {
        correctAnswer.value = true;
        showAnswer.value = false;
        testControle.value.nbBonneReponse++;
        if (currentIndex.value < totalQuestions.value - 1) {
            nextQuestion();
        } else {
            try {
                const testControleCreated = await TestControleService.createTestControle(testControle.value);
                router.push(`/final-screen/${testControleCreated.id}`);
            } catch (error) {
                console.error('Erreur lors de la création du test contrôle:', error);
                // Gérer l'erreur - par exemple afficher un message à l'utilisateur
                alert('Erreur lors de la sauvegarde du résultat. Veuillez réessayer.');
            }
        }
    } else {
        showAnswer.value = true;
        testControle.value.nbBonneReponse--;
    }
};

const nextQuestion = () => {
    if (currentIndex.value < totalQuestions.value - 1) {
        currentIndex.value++;
        showAnswer.value = false;
        answer.value = '';
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