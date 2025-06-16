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
            
            <div class="result-card">
                <div class="trophy-icon">🏆</div>
                <h1 class="title">Félicitations !</h1>
                <p class="subtitle">Vous avez terminé la leçon avec succès !</p>
                <div class="actions">
                    <button class="btn primary" @click="goToHome">
                        <span class="icon">🏠</span>
                        Retour à l'accueil
                    </button>
                    <button class="btn secondary" @click="retryLesson">
                        <span class="icon">🔄</span>
                        Réessayer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const goToHome = () => {
    router.push('/');
};

const retryLesson = () => {
    router.back();
};
</script>

<style scoped>
.final-screen {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 2rem;
}

.final-screen-content {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.result-card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.5s ease-out;
}

.trophy-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: bounce 1s ease infinite;
}

.title {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
}

.subtitle {
    color: #666;
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
}

.btn.primary {
    background: #3498db;
    color: white;
}

.btn.primary:hover {
    background: #2980b9;
    transform: translateY(-2px);
}

.btn.secondary {
    background: #f8f9fa;
    color: #2c3e50;
    border: 2px solid #e9ecef;
}

.btn.secondary:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}

.icon {
    font-size: 1.2rem;
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

/* Responsive design */
@media (max-width: 768px) {
    .final-screen {
        padding: 1rem;
    }

    .result-card {
        padding: 1.5rem;
    }

    .title {
        font-size: 2rem;
    }

    .stats-container {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }

    .actions {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>