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

    .subtitle {
        font-size: var(--font-size-base);
    }

    .actions {
        flex-direction: column;
        align-items: center;
    }

    .btn {
        width: 100%;
        max-width: 300px;
    }

    .trophy-icon {
        font-size: 3rem;
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

    .subtitle {
        font-size: var(--font-size-sm);
        margin-bottom: var(--spacing-lg);
    }

    .actions {
        margin-top: var(--spacing-lg);
        gap: var(--spacing-sm);
    }

    .btn {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-sm);
        min-height: 44px;
    }

    .trophy-icon {
        font-size: 2.5rem;
        margin-bottom: var(--spacing-sm);
    }

    .icon {
        font-size: var(--font-size-base);
    }
}

@media (min-width: 1024px) {
    .final-screen-content {
        max-width: 700px;
    }

    .result-card {
        padding: var(--spacing-2xl);
    }

    .title {
        font-size: var(--font-size-4xl);
    }

    .actions {
        gap: var(--spacing-lg);
    }

    .btn {
        padding: var(--spacing-lg) var(--spacing-xl);
        font-size: var(--font-size-lg);
        min-height: 56px;
    }
}

/* Réduction de mouvement pour l'accessibilité */
@media (prefers-reduced-motion: reduce) {
    .result-card {
        animation: none;
    }

    .trophy-icon {
        animation: none;
    }

    .confetti {
        animation: none;
        display: none;
    }

    .btn:hover {
        transform: none;
    }
}
</style>