<template>
    <div class="lesson-container">
        <div class="flash-card">
            <div class="flash-card-front">
                <h1>{{ currentQuestion }}</h1>
            </div>
            <div v-if="showAnswer" class="flash-card-back">
                <h1>{{ currentAnswer }}</h1>
            </div>
        </div>
        <div class="question-answer">
            <input type="text" v-model="answer" @keyup.enter="checkAnswer"/>
            <button @click="checkAnswer" >Check</button>
        </div>
        <div class="navigation">
            <button @click="previousQuestion" :disabled="currentIndex === 0">Previous</button>
            <span>{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const showAnswer = ref(false);
const currentIndex = ref(0);
const answer = ref('');
const props = defineProps<{
    questions: string[];
    answers: string[];
}>();

const currentQuestion = computed(() => props.questions[currentIndex.value]);
const currentAnswer = computed(() => props.answers[currentIndex.value]);
const totalQuestions = props.questions.length;

const nextQuestion = () => {
    if (currentIndex.value < totalQuestions) {
        currentIndex.value++;
        showAnswer.value = false;
        if (currentIndex.value === totalQuestions) {
            router.push('/final-screen');
            return;
        }
    }
};

const previousQuestion = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
        showAnswer.value = false;
    }
};

const checkAnswer = () => {
    if (answer.value === currentAnswer.value) {
        showAnswer.value = true;
        nextQuestion();
        answer.value = '';
    }
    else {
        showAnswer.value = true;
    }
};
</script>

<style scoped>
.lesson-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
}

.flash-card {
    width: 100%;
    min-height: 300px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
}

.flash-card-front,
.flash-card-back {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    transition: all 0.3s ease;
}

.flash-card-front {
    background-color: #2c3e50;
    color: white;
}

.flash-card-back {
    background-color: #f8f9fa;
    color: #2c3e50;
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
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.toggle-button:hover {
    background-color: #2980b9;
}

.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
}

.navigation button {
    padding: 0.5rem 1rem;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.navigation button:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.navigation button:not(:disabled):hover {
    background-color: #2980b9;
}

.navigation span {
    font-size: 1.2rem;
    color: #2c3e50;
}
</style> 