<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<template>
  <div class="app">
    <Header />
    <main class="main-content">
      <router-view></router-view>
    </main>
    <Footer />
  </div>
</template>

<style>
:root {
  /* Couleurs principales */
  --primary-color: #3498db;
  --primary-hover: #2980b9;
  --secondary-color: #2c3e50;
  --accent-color: #e74c3c;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  
  /* Couleurs neutres */
  --white: #ffffff;
  --light-gray: #f8f9fa;
  --gray: #6c757d;
  --dark-gray: #495057;
  --border-color: #dee2e6;
  
  /* Couleurs de fond */
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --bg-dark: #2c3e50;
  
  /* Typographie */
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  /* Espacements */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Bordures */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  
  /* Ombres */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--secondary-color);
  background-color: var(--bg-primary);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* Styles globaux pour les boutons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
  min-height: 40px;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--light-gray);
  color: var(--secondary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-color);
}

.btn-danger {
  background-color: var(--accent-color);
  color: var(--white);
}

.btn-danger:hover {
  background-color: #c0392b;
}

.btn-success {
  background-color: var(--success-color);
  color: var(--white);
}

.btn-success:hover {
  background-color: #229954;
}

/* Styles globaux pour les inputs */
.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
  background-color: var(--white);
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Styles globaux pour les cartes */
.card {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  transition: box-shadow var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

/* Styles globaux pour les titres */
.title {
  color: var(--secondary-color);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.title-xl {
  font-size: var(--font-size-4xl);
}

.title-lg {
  font-size: var(--font-size-3xl);
}

.title-md {
  font-size: var(--font-size-2xl);
}

.title-sm {
  font-size: var(--font-size-xl);
}

/* Styles globaux pour les conteneurs */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.container-sm {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-md);
  }
  
  .container {
    padding: var(--spacing-md);
  }
  
  .title-xl {
    font-size: var(--font-size-3xl);
  }
  
  .title-lg {
    font-size: var(--font-size-2xl);
  }
}
</style>

