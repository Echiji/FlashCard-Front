<template>
  <div class="register-container">
    <div class="register-box card">
      <h1 class="title title-lg">Create Account</h1>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <input 
            v-model="username" 
            type="text" 
            placeholder="Username" 
            required
            class="input"
          >
        </div>
        <div class="form-group">
          <input 
            v-model="email" 
            type="email" 
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
            minlength="6"
            class="input"
          >
        </div>
        <div class="form-group">
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Confirm Password" 
            required
            minlength="6"
            class="input"
          >
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
        <div class="login-link">
          Already have an account? <router-link to="/login">Sign In</router-link>
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

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

const handleRegister = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }

    loading.value = true;
    error.value = '';
    
    const response = await authService.register({
      username: username.value,
      email: email.value,
      password: password.value
    });
    
    authStore.setUser(response.user);
    router.push('/');
  } catch (err: any) {
    error.value = err.message || 'An error occurred during registration';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color);
  padding: var(--spacing-md);
}

.register-box {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-2xl);
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.register-form {
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

.login-link {
  text-align: center;
  margin-top: var(--spacing-md);
  color: var(--gray);
  font-size: var(--font-size-sm);
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-normal);
}

.login-link a:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* Media queries */
@media (max-width: 768px) {
  .register-container {
    padding: var(--spacing-sm);
  }

  .register-box {
    padding: var(--spacing-xl);
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: var(--spacing-xs);
  }

  .register-box {
    padding: var(--spacing-lg);
  }

  .register-form {
    gap: var(--spacing-md);
  }
}

@media (min-width: 1024px) {
  .register-box {
    max-width: 450px;
  }
}
</style> 