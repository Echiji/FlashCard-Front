<!-- Profile.vue -->
<template>
    <div class="profile-container">
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Chargement du profil...</p>
        </div>
        <div v-else-if="profile" class="profile-card">
            <div class="profile-header">
                <h2 class="profile-title">Profil de {{ profile.username }}</h2>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card total">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControle }}</span>
                        <span class="stat-label">Tests effectués</span>
                    </div>
                </div>
                
                <div class="stat-card perfect">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControlePerfect }}</span>
                        <span class="stat-label">Scores parfaits</span>
                    </div>
                </div>
                
                <div class="stat-card passed">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControlePassed }}</span>
                        <span class="stat-label">Tests réussis</span>
                    </div>
                </div>
                
                <div class="stat-card failed">
                    <div class="stat-icon">❌</div>
                    <div class="stat-content">
                        <span class="stat-value">{{ profile.nbTestControleFailed }}</span>
                        <span class="stat-label">Tests échoués</span>
                    </div>
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