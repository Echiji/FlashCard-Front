<template>
    <div class="login-container">
        <div class="login-box card">
            <h1 class="title title-lg">Sign In</h1>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <input 
                        v-model="email" 
                        type="text" 
                        placeholder="Email" 
                        required
                        class="input"
                    >
                </div>
                <div class="form-group">
                    <input 
                        v-model="password" 
                        type="password" 
                        placeholder="Password" 
                        required
                        class="input"
                    >
                </div>
                <div v-if="error" class="error-message">
                    {{ error }}
                </div>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>
                <div class="register-link">
                    Don't have an account? <router-link to="/register">Sign Up</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import authService from '@/services/authService';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;
        error.value = '';
        
        const response = await authService.login({
            username: email.value,
            password: password.value
        });
        
        authStore.setUser(response.user);
        router.push('/dashboard');
    } catch (err: any) {
        error.value = err.message || 'An error occurred during login';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: var(--background-color);
    padding: var(--spacing-md);
}

.login-box {
    width: 100%;
    max-width: 400px;
    padding: var(--spacing-2xl);
    background-color: var(--white);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.error-message {
    color: var(--accent-color);
    text-align: center;
    font-size: var(--font-size-sm);
    padding: var(--spacing-sm);
    background-color: rgba(231, 76, 60, 0.1);
    border-radius: var(--border-radius-md);
    border: 1px solid rgba(231, 76, 60, 0.2);
}

.register-link {
    text-align: center;
    margin-top: var(--spacing-md);
    color: var(--gray);
    font-size: var(--font-size-sm);
}

.register-link a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-normal);
}

.register-link a:hover {
    color: var(--primary-hover);
    text-decoration: underline;
}

/* Media queries */
@media (max-width: 768px) {
    .login-container {
        padding: var(--spacing-sm);
    }

    .login-box {
        padding: var(--spacing-xl);
        max-width: 100%;
    }
}

@media (max-width: 480px) {
    .login-container {
        padding: var(--spacing-xs);
    }

    .login-box {
        padding: var(--spacing-lg);
    }

    .login-form {
        gap: var(--spacing-md);
    }
}

@media (min-width: 1024px) {
    .login-box {
        max-width: 450px;
    }
}
</style>