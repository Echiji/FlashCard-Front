<template>
    <div class="final-screen">
        <div class="final-screen-content">
            <div class="confetti-container">
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
                <div class="confetti"></div>
            </div>
            
            <div class="result-card card">
                <div class="trophy-icon">🏆</div>
                <h1 class="title title-xl">Félicitations !</h1>
                <p class="subtitle">Vous avez terminé la leçon avec succès !</p>
                
                <!-- Message spécial pour un score parfait -->
                <div v-if="isPerfect" class="perfect-score-message">
                    <div class="perfect-icon">⭐</div>
                    <p class="perfect-text">Score parfait ! C'est une masterclass ! 🎉</p>
                </div>
                
                <div class="results">
                    <div class="result-item">
                        <span class="result-label">Score :</span>
                        <span class="result-value">{{ testControle?.nbBonneReponse }} / {{ testControle?.nbQuestion }}</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Pourcentage :</span>
                        <span class="result-value">{{ testControle?.pourcentageReussite }}%</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Performance :</span>
                        <span class="performance-level" :class="performanceClass">{{ performanceText }}</span>
                    </div>
                </div>
                
                <div class="actions">
                    <button class="btn btn-primary" @click="goToHome">
                        <span class="icon">🏠</span>
                        Retour à l'accueil
                    </button>
                    <button class="btn btn-secondary" @click="retryLesson">
                        <span class="icon">🔄</span>
                        Réessayer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import testControleService from '@/services/TestControleService';
import { useAuthStore } from '@/stores/auth';


const router = useRouter();
const route = useRoute();

const testControle = ref<any>(null);
const authStore = useAuthStore();
const isPerfect = ref(false);

onMounted(async () => {
    try {
        console.log('testControleService:', testControleService);
        console.log('Type:', typeof testControleService);
        console.log('Méthodes:', Object.getOwnPropertyNames(testControleService));
        
        const testControleId = parseInt(route.params.id as string);
        console.log('ID:', testControleId);
        
        // Test si la méthode existe
        if (typeof testControleService.getTestControleById === 'function') {
            console.log('Méthode trouvée !');
            const data = await testControleService.getTestControleById(testControleId);
            testControle.value = data;
        } else {
            console.log('Méthode NON trouvée !');
        }
        
        isPerfect.value = await testControleService.isPerfect(testControleId);
    } catch (error) {
        console.error('Erreur complète:', error);
    }
});

// Déterminer la performance
const performanceClass = computed(() => {
    const pct = testControle.value?.pourcentageReussite;
    if (!pct) return 'poor';
    if (pct >= 90) return 'excellent';
    if (pct >= 80) return 'very-good';
    if (pct >= 70) return 'good';
    if (pct >= 60) return 'fair';
    if (pct >= 50) return 'passable';
    return 'poor';
});

const performanceText = computed(() => {
    const pct = testControle.value?.pourcentageReussite;
    if (!pct) return 'Insuffisant';
    if (pct >= 90) return 'Excellent';
    if (pct >= 80) return 'Très bien';
    if (pct >= 70) return 'Bien';
    if (pct >= 60) return 'Assez bien';
    if (pct >= 50) return 'Passable';
    return 'Insuffisant';
});

const goToHome = () => {
    router.push('/');
};

const retryLesson = () => {
    router.push('/courses');
};
</script>

<style scoped>
.final-screen {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--bg-dark) 0%, #16213e 100%);
    padding: var(--spacing-xl);
}

.final-screen-content {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.result-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius-xl);
    padding: var(--spacing-2xl);
    text-align: center;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.5s ease-out;
    border: none;
    backdrop-filter: blur(10px);
}

.trophy-icon {
    font-size: 4rem;
    margin-bottom: var(--spacing-md);
    animation: bounce 1s ease infinite;
}

.title {
    color: var(--secondary-color);
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-sm);
    font-weight: 700;
    line-height: 1.2;
}

.subtitle {
    color: var(--gray);
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xl);
    line-height: 1.5;
}

.perfect-score-message {
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
    border: 2px solid #ffb300;
    animation: glow 2s ease-in-out infinite alternate;
}

.perfect-icon {
    font-size: 2rem;
    margin-bottom: var(--spacing-sm);
    animation: sparkle 1.5s ease-in-out infinite;
}

.perfect-text {
    color: #8b4513;
    font-size: var(--font-size-lg);
    font-weight: 700;
    margin: 0;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.results {
    background: var(--light-gray);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin: var(--spacing-xl) 0;
    border: 1px solid var(--border-color);
}

.result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border-color);
}

.result-item:last-child {
    border-bottom: none;
}

.result-label {
    font-weight: 600;
    color: var(--secondary-color);
    font-size: var(--font-size-lg);
}

.result-value {
    font-weight: 700;
    font-size: var(--font-size-xl);
    color: var(--primary-color);
}

.performance-level {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--border-radius-md);
    font-size: var(--font-size-base);
    font-weight: 600;
}

.performance-level.excellent {
    background: #4ade80;
    color: white;
}

.performance-level.very-good {
    background: #22c55e;
    color: white;
}

.performance-level.good {
    background: #16a34a;
    color: white;
}

.performance-level.fair {
    background: #ca8a04;
    color: white;
}

.performance-level.passable {
    background: #dc2626;
    color: white;
}

.performance-level.poor {
    background: #991b1b;
    color: white;
}

.loading-results,
.error-results {
    background: var(--light-gray);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    margin: var(--spacing-xl) 0;
    color: var(--gray);
    font-style: italic;
}

.actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: center;
    margin-top: var(--spacing-xl);
    flex-wrap: wrap;
}

.btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-normal);
    border: none;
    min-height: 48px;
    text-decoration: none;
    justify-content: center;
}

.btn-primary {
    background: var(--primary-color);
    color: var(--white);
}

.btn-primary:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-secondary {
    background: var(--light-gray);
    color: var(--secondary-color);
    border: 2px solid var(--border-color);
}

.btn-secondary:hover {
    background: var(--gray);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.icon {
    font-size: var(--font-size-lg);
}

/* Animations */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

@keyframes glow {
    from {
        box-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700, 0 0 15px #ffd700;
    }
    to {
        box-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700;
    }
}

@keyframes sparkle {
    0%, 100% {
        transform: scale(1) rotate(0deg);
    }
    50% {
        transform: scale(1.2) rotate(180deg);
    }
}

/* Confetti animation */
.confetti-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #f00;
    animation: confetti-fall 3s linear infinite;
}

.confetti:nth-child(1) { left: 10%; background: #f00; animation-delay: 0s; }
.confetti:nth-child(2) { left: 30%; background: #0f0; animation-delay: 0.5s; }
.confetti:nth-child(3) { left: 50%; background: #00f; animation-delay: 1s; }
.confetti:nth-child(4) { left: 70%; background: #ff0; animation-delay: 1.5s; }
.confetti:nth-child(5) { left: 90%; background: #f0f; animation-delay: 2s; }

@keyframes confetti-fall {
    0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
    }
}

/* Media queries */
@media (max-width: 768px) {
    .final-screen {
        padding: var(--spacing-md);
    }

    .result-card {
        padding: var(--spacing-xl);
    }

    .title {
        font-size: var(--font-size-3xl);
    }

    .actions {
        flex-direction: column;
        align-items: center;
    }

    .btn {
        width: 100%;
        max-width: 300px;
    }

    .result-item {
        flex-direction: column;
        gap: var(--spacing-xs);
        text-align: center;
    }
}

@media (max-width: 480px) {
    .final-screen {
        padding: var(--spacing-sm);
    }

    .result-card {
        padding: var(--spacing-lg);
    }

    .title {
        font-size: var(--font-size-2xl);
    }

    .trophy-icon {
        font-size: 3rem;
    }

    .result-label,
    .result-value {
        font-size: var(--font-size-base);
    }
}
</style>