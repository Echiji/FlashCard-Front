<!-- Profile.vue -->
<template>
    <div class="profile-container">
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner">
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
                <div class="spinner-ring"></div>
            </div>
            <p class="loading-text">Chargement du profil...</p>
        </div>
        
        <div v-else-if="profile" class="profile-content">
            <!-- Header du profil -->
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-circle">
                        <span class="avatar-text">{{ profile.username.charAt(0).toUpperCase() }}</span>
                    </div>
                </div>
                <div class="profile-info">
                    <h1 class="profile-name">{{ profile.username }}</h1>
                    <p class="profile-subtitle">Apprenant FlashCard</p>
                </div>
            </div>

            <!-- Statistiques principales -->
            <div class="stats-overview">
                <div class="stat-card total-tests">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControle }}</span>
                        <span class="stat-label">Tests effectués</span>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" :style="{ width: '100%' }"></div>
                    </div>
                </div>

                <div class="stat-card perfect-scores">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControlePerfect }}</span>
                        <span class="stat-label">Scores parfaits</span>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" :style="{ width: profile.nbTestControle > 0 ? (profile.nbTestControlePerfect / profile.nbTestControle * 100) + '%' : '0%' }"></div>
                    </div>
                </div>

                <div class="stat-card passed-tests">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControlePassed }}</span>
                        <span class="stat-label">Tests réussis</span>
                    </div>
                    <div class="stat-progress">
                        <div class="progress-bar" :style="{ width: profile.nbTestControle > 0 ? (profile.nbTestControlePassed / profile.nbTestControle * 100) + '%' : '0%' }"></div>
                    </div>
                </div>
            </div>

            <!-- Métriques détaillées -->
            <div class="metrics-section">
                <h2 class="section-title">Métriques détaillées</h2>
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="metric-label">Taux de réussite</div>
                        <div class="metric-value">
                            {{ profile.nbTestControle > 0 ? Math.round((profile.nbTestControlePassed / profile.nbTestControle) * 100) : 0 }}%
                        </div>
                        <div class="metric-bar">
                            <div class="metric-fill" :style="{ width: profile.nbTestControle > 0 ? (profile.nbTestControlePassed / profile.nbTestControle * 100) + '%' : '0%' }"></div>
                        </div>
                    </div>

                    <div class="metric-item">
                        <div class="metric-label">Taux de perfection</div>
                        <div class="metric-value">
                            {{ profile.nbTestControle > 0 ? Math.round((profile.nbTestControlePerfect / profile.nbTestControle) * 100) : 0 }}%
                        </div>
                        <div class="metric-bar">
                            <div class="metric-fill perfect" :style="{ width: profile.nbTestControle > 0 ? (profile.nbTestControlePerfect / profile.nbTestControle * 100) + '%' : '0%' }"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Message d'encouragement -->
            <div class="encouragement-card">
                <div class="encouragement-icon">🎯</div>
                <div class="encouragement-content">
                    <h3>Continuez comme ça !</h3>
                    <p v-if="profile.nbTestControlePerfect > 0">
                        Vous avez obtenu {{ profile.nbTestControlePerfect }} score{{ profile.nbTestControlePerfect > 1 ? 's' : '' }} parfait{{ profile.nbTestControlePerfect > 1 ? 's' : '' }} ! 
                        C'est excellent, gardez cette motivation !
                    </p>
                    <p v-else-if="profile.nbTestControlePassed > 0">
                        Vous avez réussi {{ profile.nbTestControlePassed }} test{{ profile.nbTestControlePassed > 1 ? 's' : '' }} ! 
                        Continuez à vous entraîner pour améliorer vos résultats.
                    </p>
                    <p v-else>
                        Commencez votre apprentissage en effectuant votre premier test !
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ProfileService from '@/services/ProfileService';

const profile = ref(null);
const loading = ref(true);

onMounted(async () => {
    try {
        profile.value = await ProfileService.getUserProfile();
    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.profile-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    color: white;
}

.loading-spinner {
    position: relative;
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
}

.spinner-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
    animation-delay: 0.2s;
    border-top-color: rgba(255, 255, 255, 0.7);
}

.spinner-ring:nth-child(3) {
    animation-delay: 0.4s;
    border-top-color: rgba(255, 255, 255, 0.4);
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 1.1rem;
    font-weight: 500;
    opacity: 0.9;
}

.profile-content {
    max-width: 1200px;
    margin: 0 auto;
    animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.profile-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-avatar {
    flex-shrink: 0;
}

.avatar-circle {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
}

.avatar-text {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
}

.profile-info {
    flex: 1;
}

.profile-name {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.profile-subtitle {
    font-size: 1.1rem;
    color: #6c757d;
    font-weight: 500;
}

.stats-overview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
}

.stat-card.total-tests::before {
    background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.stat-card.perfect-scores::before {
    background: linear-gradient(90deg, #ffecd2, #fcb69f);
}

.stat-card.passed-tests::before {
    background: linear-gradient(90deg, #a8edea, #fed6e3);
}



.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: white;
}

.stat-card.total-tests .stat-icon {
    background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.stat-card.perfect-scores .stat-icon {
    background: linear-gradient(135deg, #ffecd2, #fcb69f);
}

.stat-card.passed-tests .stat-icon {
    background: linear-gradient(135deg, #a8edea, #fed6e3);
}



.stat-icon svg {
    width: 24px;
    height: 24px;
}

.stat-content {
    margin-bottom: 1rem;
}

.stat-value {
    display: block;
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-progress {
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 2px;
    transition: width 1s ease-out;
}

.metrics-section {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.metric-item {
    padding: 1rem;
    border-radius: 12px;
    background: rgba(248, 249, 250, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.metric-label {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.metric-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.75rem;
}

.metric-bar {
    height: 6px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.metric-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 3px;
    transition: width 1s ease-out;
}

.metric-fill.perfect {
    background: linear-gradient(90deg, #ffecd2, #fcb69f);
}



.encouragement-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: slideInUp 0.8s ease-out 0.3s both;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.encouragement-icon {
    font-size: 3rem;
    flex-shrink: 0;
}

.encouragement-content h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}

.encouragement-content p {
    color: #6c757d;
    line-height: 1.6;
    margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .profile-container {
        padding: 1rem 0.5rem;
    }
    
    .profile-header {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
    }
    
    .avatar-circle {
        width: 70px;
        height: 70px;
    }
    
    .avatar-text {
        font-size: 1.8rem;
    }
    
    .profile-name {
        font-size: 1.8rem;
    }
    
    .stats-overview {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .stat-card {
        padding: 1.25rem;
    }
    
    .stat-value {
        font-size: 2rem;
    }
    
    .metrics-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .encouragement-card {
        flex-direction: column;
        text-align: center;
        padding: 1.5rem;
    }
    
    .encouragement-icon {
        font-size: 2.5rem;
    }
}

@media (max-width: 480px) {
    .profile-header {
        padding: 1rem;
    }
    
    .avatar-circle {
        width: 60px;
        height: 60px;
    }
    
    .avatar-text {
        font-size: 1.5rem;
    }
    
    .profile-name {
        font-size: 1.5rem;
    }
    
    .stat-card {
        padding: 1rem;
    }
    
    .stat-value {
        font-size: 1.8rem;
    }
    
    .metrics-section,
    .encouragement-card {
        padding: 1rem;
    }
}
</style>